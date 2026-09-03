// MCP Apps resource for list_pending_changes — a status card (branch/PR
// check status, changed files, preview link, Sanity drafts) rendered by
// hosts that support the MCP Apps extension (Claude, ChatGPT; see
// https://mcpui.dev). Hosts that don't just show the tool's plain text
// result instead — this is additive, not a replacement.
//
// Includes a real Publish button: it calls app.callServerTool({name:
// "publish_changes"}) directly (the App runtime's built-in bridge back to
// this MCP server — see @modelcontextprotocol/ext-apps' `callServerTool`),
// the same publish_changes tool the chat path already uses. Tool visibility
// defaults to both "model" and "app" per the MCP Apps spec, so no server
// metadata change was needed for the button to be allowed to call it.
//
// The widget loads its host-communication runtime from esm.sh at render
// time inside the sandboxed iframe — not bundled into this server, so it
// adds no dependency here (see the csp.resourceDomains entry that allows
// the iframe to fetch it).
export const PENDING_CHANGES_UI_URI =
  "ui://ramprate-admin/pending-changes.html";

export const PENDING_CHANGES_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #0a0f1a;
    color: #f5f0e8;
  }
  .card { display: flex; flex-direction: column; gap: 12px; }
  .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .dot { width: 9px; height: 9px; border-radius: 999px; flex: none; }
  .dot.success { background: #4ade80; }
  .dot.pending { background: #d4a843; }
  .dot.failure { background: #f87171; }
  .dot.unknown { background: #6b7280; }
  .muted { color: rgba(245,240,232,0.55); font-size: 13px; }
  .title { font-weight: 600; font-size: 14px; }
  .files { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
  .file { display: flex; gap: 8px; }
  .file .status { font-family: monospace; opacity: 0.7; width: 4.5em; flex: none; }
  .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  a.btn, button.btn {
    display: inline-block;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    background: #d4a843;
    color: #0a0f1a;
    text-decoration: none;
    font-weight: 600;
    font-size: 13px;
    width: fit-content;
    cursor: pointer;
    font-family: inherit;
  }
  button.btn.danger { background: #f87171; }
  button.btn:disabled { opacity: 0.5; cursor: default; }
  button.btn.ghost {
    background: transparent;
    border: 1px solid rgba(245,240,232,0.25);
    color: #f5f0e8;
  }
  .error { color: #f87171; font-size: 13px; }
  .success { color: #4ade80; font-size: 13px; }
  .empty { color: rgba(245,240,232,0.55); font-size: 13px; }
</style>
</head>
<body>
  <div id="root" class="card"><span class="muted">Loading…</span></div>
  <script type="module">
    import { App } from "https://esm.sh/@modelcontextprotocol/ext-apps@1.7.5";

    const root = document.getElementById("root");
    let confirming = false;

    function statusDot(status) {
      const cls = status === "success" ? "success"
        : status === "pending" ? "pending"
        : status === "failure" ? "failure"
        : "unknown";
      return '<span class="dot ' + cls + '"></span>';
    }

    function render(data, note) {
      if (!data || (!data.branch && (!data.drafts || data.drafts.length === 0))) {
        root.innerHTML = '<span class="empty">Nothing pending right now.</span>';
        return;
      }

      const parts = [];

      if (data.branch) {
        parts.push(
          '<div class="row">' + statusDot(data.checkStatus) +
          '<span class="title">PR #' + data.prNumber + '</span>' +
          '<span class="muted">' + data.checkStatus + '</span></div>'
        );
        if (data.files && data.files.length) {
          parts.push('<div class="files">' + data.files.map(function (f) {
            return '<div class="file"><span class="status">' + f.status + '</span><span>' + f.path + '</span></div>';
          }).join("") + '</div>');
        }
      }

      if (data.drafts && data.drafts.length) {
        parts.push('<div class="muted">' + data.drafts.length + ' unpublished content draft' + (data.drafts.length === 1 ? "" : "s") + '</div>');
      }

      const actions = [];
      if (data.previewUrl) {
        actions.push('<a class="btn ghost" href="' + data.previewUrl + '" target="_blank" rel="noopener">Open preview →</a>');
      }
      if (data.canPublish) {
        actions.push(
          confirming
            ? '<button class="btn danger" id="confirm-publish">Confirm publish</button><button class="btn ghost" id="cancel-publish">Cancel</button>'
            : '<button class="btn" id="publish">Publish</button>'
        );
      }
      if (actions.length) parts.push('<div class="actions">' + actions.join("") + '</div>');

      if (!data.canPublish) {
        parts.push('<div class="muted">Not ready to publish yet.</div>');
      }

      if (note) parts.push(note);

      root.innerHTML = parts.join("");

      const publishBtn = document.getElementById("publish");
      if (publishBtn) {
        publishBtn.onclick = function () {
          confirming = true;
          render(data);
        };
      }
      const cancelBtn = document.getElementById("cancel-publish");
      if (cancelBtn) {
        cancelBtn.onclick = function () {
          confirming = false;
          render(data);
        };
      }
      const confirmBtn = document.getElementById("confirm-publish");
      if (confirmBtn) {
        confirmBtn.onclick = async function () {
          confirmBtn.disabled = true;
          confirmBtn.textContent = "Publishing…";
          try {
            const result = await app.callServerTool({ name: "publish_changes", arguments: {} });
            const text = result.content && result.content[0] && result.content[0].text;
            const parsed = text ? JSON.parse(text) : null;
            confirming = false;
            if (result.isError || (parsed && parsed.error)) {
              render(data, '<div class="error">' + ((parsed && parsed.error) || "Publish failed.") + '</div>');
            } else {
              render(null);
              root.innerHTML = '<span class="success">Published.</span>' + root.innerHTML;
            }
          } catch (e) {
            confirming = false;
            render(data, '<div class="error">Publish failed: ' + (e && e.message ? e.message : "unknown error") + '</div>');
          }
        };
      }
    }

    const app = new App({ name: "ramprate-admin-ui", version: "1.0.0" });
    app.ontoolresult = function (params) {
      try {
        var block = params.content && params.content[0];
        var data = block && block.text ? JSON.parse(block.text) : null;
        confirming = false;
        render(data);
      } catch (e) {
        root.innerHTML = '<span class="empty">Could not read the result.</span>';
      }
    };
    app.connect();
  </script>
</body>
</html>
`;
