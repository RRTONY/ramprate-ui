import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/admin/binary-upload", () => ({
  MAX_UPLOAD_PAGE_BYTES: 4 * 1024 * 1024,
  readUploadGrant: vi.fn(),
  checkFileMatchesPath: vi.fn(() => null),
  tooBig: vi.fn(() => ({ error: "Over the limit." })),
}));
vi.mock("@/lib/admin/change-sets", () => ({
  getChangeSet: vi.fn(),
  isOpen: vi.fn(() => true),
  markEdited: vi.fn(),
}));
vi.mock("@/lib/admin/mcp-tool-context", () => ({
  buildMcpToolContext: vi.fn(),
}));
vi.mock("@/lib/admin/github-client", () => ({ putFileBase64: vi.fn() }));
vi.mock("@/lib/admin/guardrails", () => ({ isPathDenied: vi.fn(() => true) }));
vi.mock("@/lib/admin/tools", () => ({ runAdminTool: vi.fn() }));

import { GET, POST } from "@/app/api/mcp/upload/route";
import {
  checkFileMatchesPath,
  readUploadGrant,
} from "@/lib/admin/binary-upload";
import { getChangeSet, isOpen } from "@/lib/admin/change-sets";
import { buildMcpToolContext } from "@/lib/admin/mcp-tool-context";
import { putFileBase64 } from "@/lib/admin/github-client";
import { runAdminTool } from "@/lib/admin/tools";

const SANITY = {
  filename: "jane.png",
  alt: "Jane",
  attach_to: { documentId: "t1", field: "photo" },
};
const user = { name: "Rob", email: "rob@ramprate.com", role: "edit" };
const finalize = vi.fn();
const ctx = { marker: 1 };
const bytes = [137, 80, 78, 71, 1];

function grant(sanity: object = SANITY) {
  vi.mocked(readUploadGrant).mockReturnValue({
    user,
    grant: { change: "c1", path: `sanity:x.png`, sanity },
  } as never);
}
function upload() {
  const fd = new FormData();
  fd.set("t", "tok");
  fd.set(
    "file",
    new File([new Uint8Array(bytes)], "jane.png", { type: "image/png" }),
  );
  return POST(
    new Request("https://ramprate.com/api/mcp/upload", {
      method: "POST",
      body: fd,
    }),
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  grant();
  vi.mocked(isOpen).mockReturnValue(true);
  vi.mocked(getChangeSet).mockResolvedValue({
    key: "c1",
    title: "Team <photo>",
    status: "open",
  } as never);
  vi.mocked(buildMcpToolContext).mockResolvedValue({ ctx, finalize } as never);
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("upload page for a Sanity picture", () => {
  it("says where the picture will go", async () => {
    expect(
      await (
        await GET(new Request("https://ramprate.com/api/mcp/upload?t=tok"))
      ).text(),
    ).toContain("placed on the draft (as the photo)");
    grant({ filename: "x.png", alt: "x" });
    expect(
      await (
        await GET(new Request("https://ramprate.com/api/mcp/upload?t=tok"))
      ).text(),
    ).toContain("added to the website's picture library.");
  });

  it("uploads through sanity_upload_image, never GitHub, even though the path isn't a repo path", async () => {
    vi.mocked(runAdminTool).mockResolvedValue({ output: { ok: true } });
    const res = await upload();
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("It's on the draft");
    expect(checkFileMatchesPath).toHaveBeenCalledWith(
      "jane.png",
      expect.any(Buffer),
    );
    expect(runAdminTool).toHaveBeenCalledWith(
      "sanity_upload_image",
      { ...SANITY, base64Content: Buffer.from(bytes).toString("base64") },
      ctx,
    );
    expect(putFileBase64).not.toHaveBeenCalled();
    expect(finalize).toHaveBeenCalled();

    grant({ filename: "x.png", alt: "x" });
    expect(await (await upload()).text()).toContain("in the picture library");
  });

  it("shows refusals escaped and survives a crash", async () => {
    vi.mocked(runAdminTool).mockResolvedValueOnce({
      output: { error: "Belongs to <other> change" },
      isError: true,
    });
    const r = await upload();
    expect(r.status).toBe(400);
    expect(await r.text()).toContain("Belongs to &lt;other&gt; change");
    vi.mocked(runAdminTool).mockRejectedValueOnce(new Error("down"));
    expect(await (await upload()).text()).toContain(
      "The picture couldn&#39;t be saved.",
    );
    vi.mocked(runAdminTool).mockResolvedValueOnce({
      output: {},
      isError: true,
    });
    expect((await upload()).status).toBe(400);
  });
});
