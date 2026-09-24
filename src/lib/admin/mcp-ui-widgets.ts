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
// Styled to ChatGPT's app UI guidelines (and works the same in Claude):
// the host's own theme, fonts and colours via the MCP Apps style variables
// (applyDocumentTheme / applyHostStyleVariables / applyHostFonts), with
// light/dark fallbacks; brand gold only on the one primary button; at most
// two actions; no inner scrolling (long file lists collapse to "+N more");
// plain words instead of PR/check jargon. Every value from the server is
// HTML-escaped before it is shown, and the preview link must be https.
//
// Publish passes the rules version the server put in the result's _meta
// (UI-only, never shown to the model) because publish_changes is
// rules-gated, and is hidden entirely for people whose role can't publish.
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
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root {
    color-scheme: light dark;
    --fallback-text: #1f1f1f;
    --fallback-muted: #6b6b6b;
    --fallback-border: rgba(0,0,0,0.12);
    --fallback-surface: rgba(0,0,0,0.03);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --fallback-text: #ececec;
      --fallback-muted: #a3a3a3;
      --fallback-border: rgba(255,255,255,0.14);
      --fallback-surface: rgba(255,255,255,0.05);
    }
  }
  :root[data-theme="dark"] {
    --fallback-text: #ececec;
    --fallback-muted: #a3a3a3;
    --fallback-border: rgba(255,255,255,0.14);
    --fallback-surface: rgba(255,255,255,0.05);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 16px;
    background: transparent;
    color: var(--color-text-primary, var(--fallback-text));
    font-family: var(--font-sans, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
    font-size: var(--font-text-md-size, 14px);
    line-height: var(--font-text-md-line-height, 1.45);
  }
  .card { display: flex; flex-direction: column; gap: 12px; }
  h2 {
    margin: 0;
    font-size: var(--font-heading-sm-size, 16px);
    line-height: var(--font-heading-sm-line-height, 1.3);
    font-weight: var(--font-weight-semibold, 600);
  }
  .muted { color: var(--color-text-secondary, var(--fallback-muted)); font-size: var(--font-text-sm-size, 13px); }
  .status { display: flex; align-items: center; gap: 8px; font-size: var(--font-text-sm-size, 13px); }
  .dot { width: 8px; height: 8px; border-radius: 999px; flex: none; }
  .dot.success { background: var(--color-text-success, #16a34a); }
  .dot.pending { background: var(--color-text-warning, #d97706); }
  .dot.failure { background: var(--color-text-danger, #dc2626); }
  .dot.unknown { background: var(--color-text-tertiary, #9ca3af); }
  ul.files {
    list-style: none; margin: 0; padding: 8px 10px;
    border-radius: var(--border-radius-md, 8px);
    background: var(--color-background-secondary, var(--fallback-surface));
    display: flex; flex-direction: column; gap: 4px;
    font-size: var(--font-text-sm-size, 13px);
  }
  ul.files li { display: flex; gap: 8px; min-width: 0; }
  .kind { color: var(--color-text-secondary, var(--fallback-muted)); flex: none; width: 4.5em; }
  .path { overflow-wrap: anywhere; font-family: var(--font-mono, ui-monospace, monospace); font-size: 12px; }
  .note { font-size: var(--font-text-sm-size, 13px); }
  .note.error { color: var(--color-text-danger, #dc2626); }
  .note.success { color: var(--color-text-success, #16a34a); }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
  .btn {
    appearance: none; border: 0; cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 36px; padding: 0 14px;
    border-radius: var(--border-radius-full, 999px);
    font: inherit; font-size: var(--font-text-sm-size, 13px);
    font-weight: var(--font-weight-semibold, 600);
  }
  .btn:focus-visible { outline: 2px solid var(--color-ring-primary, #2563eb); outline-offset: 2px; }
  .btn:disabled { opacity: 0.55; cursor: default; }
  /* Brand accent reserved for the single primary action, per ChatGPT's UI guidelines. */
  .btn.primary { background: #d4a843; color: #2a1f14; }
  .btn.secondary {
    background: transparent;
    color: var(--color-text-primary, var(--fallback-text));
    box-shadow: inset 0 0 0 1px var(--color-border-primary, var(--fallback-border));
  }
</style>
</head>
<body>
  <div id="root" class="card" aria-live="polite"><span class="muted">Loading…</span></div>
  <script type="module">
    import { App, applyDocumentTheme, applyHostStyleVariables, applyHostFonts }
      from "https://esm.sh/@modelcontextprotocol/ext-apps@1.7.5";

    const MAX_FILES = 8;
    const root = document.getElementById("root");
    let data = null;
    let rulesVersion = null;
    let confirming = false;
    let busy = false;
    let note = "";

    function esc(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    const CHECK = {
      success: ["success", "Site check passed"],
      pending: ["pending", "Site check still running"],
      failure: ["failure", "Site check failed, this needs a fix first"],
    };
    const KIND = { added: "New", modified: "Changed", removed: "Removed", renamed: "Renamed" };

    function render() {
      const hasCode = data && data.branch;
      const drafts = (data && data.drafts) || [];
      if (!data || (!hasCode && drafts.length === 0)) {
        root.innerHTML = (note ? '<div class="note ' + note.kind + '">' + esc(note.text) + '</div>' : "") +
          '<span class="muted">Nothing is waiting to go live.</span>';
        return;
      }

      const parts = ['<h2>Website changes waiting to go live</h2>'];

      if (hasCode) {
        const c = CHECK[data.checkStatus] || ["unknown", "Site check status unknown"];
        parts.push('<div class="status"><span class="dot ' + c[0] + '" aria-hidden="true"></span><span>' + esc(c[1]) + '</span></div>');
        const files = data.files || [];
        if (files.length) {
          const shown = files.slice(0, MAX_FILES).map(function (f) {
            return '<li><span class="kind">' + esc(KIND[f.status] || f.status) + '</span><span class="path">' + esc(f.path) + '</span></li>';
          });
          if (files.length > MAX_FILES) shown.push('<li class="muted">+' + (files.length - MAX_FILES) + ' more</li>');
          parts.push('<ul class="files" aria-label="Changed files">' + shown.join("") + '</ul>');
        }
      }
      if (drafts.length) {
        parts.push('<div class="muted">' + drafts.length + ' content update' + (drafts.length === 1 ? "" : "s") + ' (blog, pages or team) also waiting</div>');
      }

      if (note) parts.push('<div class="note ' + note.kind + '">' + esc(note.text) + '</div>');

      const actions = [];
      const preview = hasCode && data.checkStatus === "success" && typeof data.previewUrl === "string" && data.previewUrl.indexOf("https://") === 0
        ? data.previewUrl : null;

      if (data.canPublish && data.youCanPublish && rulesVersion) {
        if (confirming) {
          actions.push('<button class="btn primary" id="confirm"' + (busy ? " disabled" : "") + '>' + (busy ? "Publishing…" : "Yes, publish now") + '</button>');
          actions.push('<button class="btn secondary" id="cancel"' + (busy ? " disabled" : "") + '>Cancel</button>');
        } else {
          actions.push('<button class="btn primary" id="publish">Publish</button>');
          if (preview) actions.push('<a class="btn secondary" href="' + esc(preview) + '" target="_blank" rel="noopener noreferrer">Open preview</a>');
        }
      } else {
        if (preview) actions.push('<a class="btn secondary" href="' + esc(preview) + '" target="_blank" rel="noopener noreferrer">Open preview</a>');
        if (data.canPublish && !data.youCanPublish) {
          parts.push('<div class="muted">Ready to publish. Ask a team member with publish access to approve it.</div>');
        } else if (data.canPublish && !rulesVersion) {
          parts.push('<div class="muted">Ready to publish. Ask in the chat to publish it.</div>');
        } else if (data.checkStatus === "pending") {
          parts.push('<div class="muted">Ask again in a minute to see the preview.</div>');
        }
      }
      if (confirming) parts.push('<div class="muted">This makes the changes live on ramprate.com.</div>');
      if (actions.length) parts.push('<div class="actions">' + actions.join("") + '</div>');

      root.innerHTML = parts.join("");
      wire();
    }

    function wire() {
      const publish = document.getElementById("publish");
      if (publish) publish.onclick = function () { confirming = true; note = ""; render(); };
      const cancel = document.getElementById("cancel");
      if (cancel) cancel.onclick = function () { confirming = false; render(); };
      const confirm = document.getElementById("confirm");
      if (confirm) confirm.onclick = doPublish;
    }

    async function doPublish() {
      busy = true;
      render();
      try {
        const result = await app.callServerTool({ name: "publish_changes", arguments: { rules_version: rulesVersion } });
        const out = result.structuredContent || readText(result);
        busy = false;
        confirming = false;
        if (result.isError || (out && out.error)) {
          note = { kind: "error", text: (out && out.error) || "Publishing didn't work." };
          render();
        } else {
          data = null;
          note = { kind: "success", text: "Published. The live site updates in a few minutes." };
          render();
        }
      } catch (e) {
        busy = false;
        confirming = false;
        note = { kind: "error", text: "Publishing didn't work: " + (e && e.message ? e.message : "unknown error") };
        render();
      }
    }

    function readText(result) {
      try {
        const block = result && result.content && result.content[0];
        return block && block.text ? JSON.parse(block.text) : null;
      } catch (e) {
        return null;
      }
    }

    function applyHost(ctx) {
      if (!ctx) return;
      if (ctx.theme) applyDocumentTheme(ctx.theme);
      if (ctx.styles && ctx.styles.variables) applyHostStyleVariables(ctx.styles.variables);
      if (ctx.styles && ctx.styles.css && ctx.styles.css.fonts) applyHostFonts(ctx.styles.css.fonts);
    }

    const app = new App({ name: "ramprate-admin-ui", version: "2.0.0" }, {}, { autoResize: true });
    app.ontoolresult = function (params) {
      data = params.structuredContent || readText(params);
      rulesVersion = (params._meta && params._meta.rulesVersion) || null;
      confirming = false;
      busy = false;
      note = "";
      if (!data) {
        root.innerHTML = '<span class="muted">Couldn\\'t read the pending changes. Ask again in the chat.</span>';
        return;
      }
      render();
    };
    app.onhostcontextchanged = function (ctx) { applyHost(ctx); };
    await app.connect();
    applyHost(app.getHostContext());
  </script>
</body>
</html>
`;
