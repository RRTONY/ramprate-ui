import * as gh from "@/lib/admin/github-client";
import {
  branchForChange,
  claimContent,
  patchChangeSet,
  type ChangeSet,
} from "@/lib/admin/change-sets";
import type { AdminToolContext, Download } from "@/lib/admin/tools";

export interface McpToolCallResult {
  ctx: AdminToolContext;
  auditLog: string[];
  downloads: Download[];
  // Opens the change's PR the moment its branch has its first commit
  // (GitHub rejects a PR with no diff from base, so this can't happen any
  // earlier) and saves the PR number on the change record, then reports the
  // branch/PR either way. Call once, after running the tool.
  finalize: () => Promise<{
    branch: string | null;
    prNumber: number | null;
    prUrl: string | null;
  }>;
}

// MCP tool calls are independent HTTP requests with no memory between them
// (Netlify Functions), so every call names the change it belongs to
// (change_id, from start_change) and this resolves that change's own branch
// and PR from its record. One request = one change = one branch, so two
// requests can never end up in the same Publish. With no change (read-only
// calls) reads come from the live site's code.
export async function buildMcpToolContext(
  change: ChangeSet | null,
): Promise<McpToolCallResult> {
  const defaultBranch = await gh.getDefaultBranch();
  let branch: string | null = change?.branch ?? null;
  let prNumber: number | null = change?.prNumber ?? null;

  const auditLog: string[] = [];
  const downloads: Download[] = [];

  const ctx: AdminToolContext = {
    getReadBranch: () => branch ?? defaultBranch,
    ensureWriteBranch: async () => {
      if (!change) {
        throw new Error(
          "Start a change first (start_change) and pass its change_id.",
        );
      }
      if (branch) return branch;
      branch = branchForChange(change.key);
      await gh.createBranch(branch);
      await patchChangeSet(change.key, { branch });
      change.branch = branch;
      auditLog.push(`Created branch ${branch}`);
      return branch;
    },
    getPRNumber: () => prNumber,
    // Chat-only concept (attachments arrive on a chat message); MCP clients
    // that need to write binary content pass it straight to
    // github_write_binary_file's base64Content argument instead.
    getAttachment: () => null,
    recordDownload: (file) => downloads.push(file),
    log: (entry) => auditLog.push(entry),
    claimContent: async (item) =>
      change
        ? claimContent(change, item)
        : "Start a change first (start_change) and pass its change_id.",
  };

  return {
    ctx,
    auditLog,
    downloads,
    finalize: async () => {
      let prUrl: string | null = null;
      if (change && branch && !prNumber) {
        let pr: gh.OpenPR;
        try {
          pr = await gh.openPR(
            branch,
            change.title,
            `${change.request}\n\nRequested by ${change.requestedBy.name} via the MCP admin server (change ${change.key}). Review it in ChatGPT/Claude before publishing.`,
          );
        } catch (err) {
          // 422 = the branch has no commits yet (the write failed); the PR
          // opens on the next successful write instead.
          if (gh.errorStatus(err) === 422) return { branch, prNumber, prUrl };
          throw err;
        }
        prNumber = pr.number;
        prUrl = pr.url;
        await patchChangeSet(change.key, { prNumber });
        change.prNumber = prNumber;
        auditLog.push(`Opened PR #${pr.number}`);
      } else if (prNumber) {
        prUrl = `https://github.com/${gh.GITHUB_REPO.owner}/${gh.GITHUB_REPO.repo}/pull/${prNumber}`;
      }
      return { branch, prNumber, prUrl };
    },
  };
}
