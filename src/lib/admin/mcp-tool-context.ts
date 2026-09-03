import * as gh from "@/lib/admin/github-client";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import type { AdminToolContext, Download } from "@/lib/admin/tools";

function newBranchName(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${ADMIN_BRANCH_PREFIX}${stamp}-${suffix}`;
}

export interface McpToolCallResult {
  ctx: AdminToolContext;
  auditLog: string[];
  downloads: Download[];
  // Opens the PR the moment a branch has its first commit (GitHub rejects a
  // PR with no diff from base, so this can't happen any earlier than that),
  // and reports the branch/PR this call ended up on either way. Call once,
  // after running the tool. Without this, a later independent tool call —
  // which resolves "the pending change" via findOpenAdminPR, see below —
  // would never find this branch, and every write would silently start a
  // new orphan branch of its own.
  finalize: () => Promise<{
    branch: string | null;
    prNumber: number | null;
    prUrl: string | null;
  }>;
}

// The admin chat UI threads a branch/PR through a session cookie across a
// whole conversation. MCP tool calls have no such thing to lean on — each
// one is an independent HTTP request, and Netlify Functions guarantee no
// memory between invocations — so instead of session state, every call
// resolves "the pending change" fresh by asking GitHub whether an admin
// branch/PR is already open (same single-operator assumption the chat UI
// makes: only one edit in flight at a time). This also means the MCP server
// needs no cookies or session store at all.
export async function buildMcpToolContext(): Promise<McpToolCallResult> {
  const defaultBranch = await gh.getDefaultBranch();
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  let branch: string | null = existing?.branch ?? null;
  let prNumber: number | null = existing?.number ?? null;

  const auditLog: string[] = [];
  const downloads: Download[] = [];

  const ctx: AdminToolContext = {
    getReadBranch: () => branch ?? defaultBranch,
    ensureWriteBranch: async () => {
      if (branch) return branch;
      branch = newBranchName();
      await gh.createBranch(branch);
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
  };

  return {
    ctx,
    auditLog,
    downloads,
    finalize: async () => {
      let prUrl: string | null = null;
      if (branch && !prNumber) {
        const pr = await gh.openPR(
          branch,
          "MCP: site edits",
          "Opened automatically via the MCP admin server. Review the diff before publishing.",
        );
        prNumber = pr.number;
        prUrl = pr.url;
        auditLog.push(`Opened PR #${pr.number}`);
      } else if (prNumber) {
        prUrl = `https://github.com/${gh.GITHUB_REPO.owner}/${gh.GITHUB_REPO.repo}/pull/${prNumber}`;
      }
      return { branch, prNumber, prUrl };
    },
  };
}
