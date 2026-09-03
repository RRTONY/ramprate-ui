// MCP Apps resource for list_pending_changes — a read-only status card
// (branch/PR check status, changed files, preview link, Sanity drafts)
// rendered by hosts that support the MCP Apps extension (Claude, ChatGPT;
// see https://mcpui.dev). Hosts that don't just show the tool's plain text
// result instead — this is additive, not a replacement.
//
// Deliberately display-only for now: no button here calls publish_changes
// directly. That needs the full bidirectional app<->host tool-invocation
// protocol (@modelcontextprotocol/ext-apps' request/response bridge, CSP
// wiring for the call to reach back to this server), which is real
// additional scope beyond this first pass. Publishing still happens by
// asking in chat, same as before.
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
  a.btn {
    display: inline-block;
    padding: 8px 14px;
    border-radius: 8px;
    background: #d4a843;
    color: #0a0f1a;
    text-decoration: none;
    font-weight: 600;
    font-size: 13px;
    width: fit-content;
  }
  .empty { color: rgba(245,240,232,0.55); font-size: 13px; }
</style>
</head>
<body>
  <div id="root" class="card"><span class="muted">Loading…</span></div>
  <script type="module">
    import { App } from "https://esm.sh/@modelcontextprotocol/ext-apps@1.7.5";

    const root = document.getElementById("root");

    function statusDot(status) {
      const cls = status === "success" ? "success"
        : status === "pending" ? "pending"
        : status === "failure" ? "failure"
        : "unknown";
      return '<span class="dot ' + cls + '"></span>';
    }

    function render(data) {
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
        if (data.previewUrl) {
          parts.push('<a class="btn" href="' + data.previewUrl + '" target="_blank" rel="noopener">Open preview →</a>');
        }
      }

      if (data.drafts && data.drafts.length) {
        parts.push('<div class="muted">' + data.drafts.length + ' unpublished content draft' + (data.drafts.length === 1 ? "" : "s") + '</div>');
      }

      parts.push(
        '<div class="muted">' +
        (data.canPublish ? "Ready to publish — say so in chat to go live." : "Not ready to publish yet.") +
        "</div>"
      );

      root.innerHTML = parts.join("");
    }

    const app = new App({ name: "ramprate-admin-ui", version: "1.0.0" });
    app.ontoolresult = function (params) {
      try {
        var block = params.content && params.content[0];
        var data = block && block.text ? JSON.parse(block.text) : null;
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
