// MCP Apps resource for list_pending_changes: a review card rendered by
// hosts that support the MCP Apps extension (ChatGPT, Claude; see
// https://mcpui.dev). Hosts that don't just show the tool's plain text
// result instead, so this is additive, not a replacement.
//
// Two layouts, one per result (never a drill-down inside the card):
// - One change ("detail"): who asked, status, the AI's plain summary plus
//   server-written facts (what is and isn't included), the pages and
//   content that will go live with preview links, before vs after, the site
//   check, and two actions: Publish (primary) and Discard (secondary). Both
//   go through an in-card confirm step (window.confirm isn't reliable in a
//   sandboxed iframe). Publish sends the change_id and the reviewToken the
//   card was showing, so the server refuses if anything changed since.
// - Several changes ("list"): a plain list with each change's status, plus
//   older waiting work and unrelated Studio drafts that will NOT go live.
//   No buttons; the person asks in the chat to review one.
//
// Buttons call the server through the App runtime's callServerTool bridge
// (@modelcontextprotocol/ext-apps). publish_changes and discard_change are
// rules-gated, so the card passes the rules version the server put in the
// result's _meta (card-only, never shown to the model). Each button is
// hidden for roles that can't use it.
//
// Follows OpenAI's Apps SDK UI guidelines (and works the same in Claude):
// host theme, fonts and colours via applyDocumentTheme /
// applyHostStyleVariables / applyHostFonts with light/dark fallbacks; brand
// gold only on the one primary button; at most two actions, at the bottom;
// no inner scrolling (long lists collapse to "+N more"); plain words. Every
// server value is HTML-escaped and links must be https. No red anywhere
// (team standard): failures use the brand purple plus words, never colour
// alone, and not the host's "danger" colour, which is red.
//
// The runtime loads from esm.sh inside the sandboxed iframe (csp
// resourceDomains), so it adds no dependency to this server. The URI is
// versioned because ChatGPT caches a card's HTML by URI.
export const PENDING_CHANGES_UI_URI =
  "ui://ramprate-admin/pending-changes-v2.html";

export const PENDING_CHANGES_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root {
    color-scheme: light dark;
    --fallback-text: #1f1f1f;
    --fallback-muted: #5f5f5f;
    --fallback-border: rgba(0,0,0,0.12);
    --fallback-surface: rgba(0,0,0,0.035);
    --alert: #4A1D5E;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --fallback-text: #ececec;
      --fallback-muted: #b0b0b0;
      --fallback-border: rgba(255,255,255,0.14);
      --fallback-surface: rgba(255,255,255,0.05);
      --alert: #D3B5E3;
    }
  }
  :root[data-theme="dark"] {
    --fallback-text: #ececec;
    --fallback-muted: #b0b0b0;
    --fallback-border: rgba(255,255,255,0.14);
    --fallback-surface: rgba(255,255,255,0.05);
    --alert: #D3B5E3;
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
  h3 {
    margin: 0 0 4px;
    font-size: var(--font-text-sm-size, 13px);
    font-weight: var(--font-weight-semibold, 600);
  }
  p { margin: 0; }
  .muted { color: var(--color-text-secondary, var(--fallback-muted)); font-size: var(--font-text-sm-size, 13px); }
  .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: var(--font-weight-semibold, 600);
    padding: 2px 8px; border-radius: var(--border-radius-full, 999px);
    white-space: nowrap; flex: none;
    box-shadow: inset 0 0 0 1px var(--color-border-primary, var(--fallback-border));
  }
  .dot { width: 8px; height: 8px; border-radius: 999px; flex: none; }
  .dot.success { background: var(--color-text-success, #15803d); }
  .dot.pending { background: var(--color-text-warning, #b45309); }
  .dot.failure { background: var(--alert); }
  .dot.unknown { background: var(--color-text-tertiary, #9ca3af); }
  .box {
    margin: 0; padding: 10px 12px; list-style: none;
    border-radius: var(--border-radius-md, 8px);
    background: var(--color-background-secondary, var(--fallback-surface));
    display: flex; flex-direction: column; gap: 6px;
    font-size: var(--font-text-sm-size, 13px);
  }
  .box li { min-width: 0; overflow-wrap: anywhere; }
  .row { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
  .row .muted { flex: none; }
  a { color: inherit; text-underline-offset: 2px; }
  .ba { display: grid; grid-template-columns: 4.2em 1fr; gap: 2px 8px; }
  .ba .k { color: var(--color-text-secondary, var(--fallback-muted)); }
  .ba .before { text-decoration: line-through; text-decoration-thickness: 1px; color: var(--color-text-secondary, var(--fallback-muted)); }
  .note { font-size: var(--font-text-sm-size, 13px); }
  .note.error { color: var(--alert); font-weight: var(--font-weight-semibold, 600); }
  .note.success { color: var(--color-text-success, #15803d); }
  .confirm {
    padding: 10px 12px; border-radius: var(--border-radius-md, 8px);
    box-shadow: inset 0 0 0 1px var(--color-border-primary, var(--fallback-border));
    font-size: var(--font-text-sm-size, 13px);
  }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
  .btn {
    appearance: none; border: 0; cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 40px; padding: 0 16px;
    border-radius: var(--border-radius-full, 999px);
    font: inherit; font-size: var(--font-text-sm-size, 13px);
    font-weight: var(--font-weight-semibold, 600);
  }
  .btn:focus-visible { outline: 2px solid var(--color-ring-primary, #2563eb); outline-offset: 2px; }
  .btn:disabled { opacity: 0.55; cursor: default; }
  /* Brand accent only on the single primary action, per the UI guidelines. */
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

    const MAX_ITEMS = 6;
    const MAX_BEFORE_AFTER = 4;
    const root = document.getElementById("root");
    let data = null;
    let rulesVersion = null;
    let confirming = null; // "publish" | "discard" | null
    let busy = false;
    let done = false;
    let note = null;

    function esc(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function safeUrl(url) {
      return typeof url === "string" && url.indexOf("https://") === 0 ? url : null;
    }
    function when(iso) {
      const d = new Date(iso);
      return isNaN(d) ? "" : d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    }
    function capped(items, render) {
      const shown = items.slice(0, MAX_ITEMS).map(render);
      if (items.length > MAX_ITEMS) shown.push('<li class="muted">+' + (items.length - MAX_ITEMS) + ' more</li>');
      return shown.join("");
    }
    function noteHtml() {
      return note ? '<div class="note ' + note.kind + '" role="status">' + esc(note.text) + '</div>' : "";
    }

    const CHECK = {
      success: ["success", "Site check passed"],
      pending: ["pending", "Site check still running"],
      failure: ["failure", "Site check failed"],
    };
    const STATUS_DOT = { draft: "unknown", ready_for_review: "pending", published: "success", discarded: "unknown" };

    function renderList() {
      const changes = data.changes || [];
      const older = data.olderChanges || [];
      const drafts = data.unrelatedDrafts || [];
      const parts = [];
      if (data.error) parts.push('<div class="note error">' + esc(data.error) + '</div>');
      if (!changes.length && !older.length) {
        parts.push('<span class="muted">Nothing is waiting to go live.</span>');
      } else {
        parts.push('<h2>Website changes waiting</h2>');
        if (changes.length) {
          parts.push('<ul class="box" aria-label="Waiting changes">' + capped(changes, function (c) {
            return '<li class="row"><span>' + esc(c.title) + ' <span class="muted">· ' + esc(c.requestedBy) + ', ' + esc(when(c.createdAt)) + '</span></span>' +
              '<span class="chip"><span class="dot ' + (STATUS_DOT[c.status] || "unknown") + '" aria-hidden="true"></span>' + esc(c.statusLabel) + '</span></li>';
          }) + '</ul>');
          parts.push('<p class="muted">Each change is reviewed and published on its own. Ask in the chat to review one by name.</p>');
        }
        if (older.length) {
          parts.push('<p class="muted">' + older.length + ' older waiting change' + (older.length === 1 ? "" : "s") + ' from before this update. These can be discarded, not published. Ask in the chat to discard them.</p>');
        }
      }
      if (drafts.length) {
        parts.push('<p class="muted">' + (drafts.length === 1 ? "1 unsaved edit in Sanity Studio belongs" : drafts.length + " unsaved edits in Sanity Studio belong") + ' to no change and will not be published from here.</p>');
      }
      parts.push(noteHtml());
      root.innerHTML = parts.join("");
    }

    function renderDetail() {
      const d = data;
      const parts = [];
      parts.push('<h2>' + esc(d.title) + '</h2>');
      const c = d.checkStatus ? (CHECK[d.checkStatus] || ["unknown", "Site check status unknown"]) : null;
      parts.push('<div class="meta">' +
        '<span class="chip"><span class="dot ' + (STATUS_DOT[d.status] || "unknown") + '" aria-hidden="true"></span>' + esc(d.statusLabel) + '</span>' +
        (c ? '<span class="chip"><span class="dot ' + c[0] + '" aria-hidden="true"></span>' + esc(c[1]) + '</span>' : "") +
        '<span class="muted">Asked by ' + esc(d.requestedBy) + ', ' + esc(when(d.createdAt)) + '</span></div>');

      if (d.summary) parts.push('<p>' + esc(d.summary) + '</p>');
      parts.push('<p class="muted">' + esc(d.facts) + '</p>');

      const areas = d.areas || [];
      const content = d.content || [];
      const links = {};
      (d.previewLinks || []).forEach(function (l) { if (safeUrl(l.url)) links[l.label] = l.url; });
      if (areas.length || content.length) {
        const items = areas.map(function (a) {
          const url = links[a.label];
          return '<li class="row"><span>' + esc(a.label) + '</span>' +
            (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Preview</a>' : "") + '</li>';
        }).concat(content.map(function (x) { return '<li>' + esc(x.label) + '</li>'; }));
        parts.push('<div><h3>What will go live</h3><ul class="box" aria-label="What will go live">' + capped(items, function (h) { return h; }) + '</ul></div>');
      }

      const ba = d.beforeAfter || [];
      if (ba.length) {
        const shown = ba.slice(0, MAX_BEFORE_AFTER).map(function (b) {
          return '<li><div><strong>' + esc(b.label) + '</strong></div><div class="ba">' +
            '<span class="k">Before</span><span class="before">' + esc(b.before) + '</span>' +
            '<span class="k">After</span><span>' + esc(b.after) + '</span></div></li>';
        });
        if (ba.length > MAX_BEFORE_AFTER) shown.push('<li class="muted">+' + (ba.length - MAX_BEFORE_AFTER) + ' more changes, ask in the chat to see them all</li>');
        parts.push('<div><h3>Before and after</h3><ul class="box">' + shown.join("") + '</ul></div>');
      }

      const preview = safeUrl(d.previewUrl);
      if (preview && !(d.previewLinks || []).length) {
        parts.push('<p class="muted"><a href="' + esc(preview) + '" target="_blank" rel="noopener noreferrer">Open the preview site</a>. Check it on your phone too if the layout changed.</p>');
      } else if ((d.previewLinks || []).length) {
        parts.push('<p class="muted">Preview opens a private copy of the site with this change. Check it on your phone too if the layout changed.</p>');
      }

      if (!done && (d.blockers || []).length) {
        parts.push('<p class="muted">Not ready to publish: ' + esc(d.blockers.join(" ")) + '</p>');
      }

      if (confirming === "publish") {
        parts.push('<div class="confirm"><strong>You are about to publish these changes to the live RampRate website.</strong> Only this change goes live, nothing else. Are you sure you want to continue?</div>');
      } else if (confirming === "discard") {
        parts.push('<div class="confirm"><strong>Discard this change?</strong> Everything in it is thrown away and nothing goes live. You can always ask for it again.</div>');
      }
      parts.push(noteHtml());

      const isOpen = d.status === "draft" || d.status === "ready_for_review";
      const canPublish = !done && d.canPublish && d.youCanPublish && rulesVersion;
      const canDiscard = !done && isOpen && d.youCanDiscard && rulesVersion;
      const actions = [];
      if (confirming === "publish") {
        actions.push('<button class="btn primary" id="yes"' + (busy ? " disabled" : "") + '>' + (busy ? "Publishing…" : "Yes, publish") + '</button>');
        actions.push('<button class="btn secondary" id="cancel"' + (busy ? " disabled" : "") + '>Cancel</button>');
      } else if (confirming === "discard") {
        actions.push('<button class="btn secondary" id="yes"' + (busy ? " disabled" : "") + '>' + (busy ? "Discarding…" : "Yes, discard") + '</button>');
        actions.push('<button class="btn secondary" id="cancel"' + (busy ? " disabled" : "") + '>Cancel</button>');
      } else {
        if (canPublish) actions.push('<button class="btn primary" id="publish">Publish</button>');
        if (canDiscard) actions.push('<button class="btn secondary" id="discard">Discard</button>');
      }
      if (!done && isOpen && !rulesVersion) {
        parts.push('<p class="muted">Ask in the chat to publish or discard this change.</p>');
      } else if (!done && d.canPublish && !d.youCanPublish) {
        parts.push('<p class="muted">Ready to publish. Ask a team member with publish access to approve it.</p>');
      }
      if (actions.length) parts.push('<div class="actions">' + actions.join("") + '</div>');

      root.innerHTML = parts.join("");
      wire();
    }

    function render() {
      if (!data) return;
      if (data.view === "detail") renderDetail();
      else renderList();
    }

    function wire() {
      const bind = function (id, fn) { const el = document.getElementById(id); if (el) el.onclick = fn; };
      bind("publish", function () { confirming = "publish"; note = null; render(); });
      bind("discard", function () { confirming = "discard"; note = null; render(); });
      bind("cancel", function () { confirming = null; render(); });
      bind("yes", function () { act(confirming); });
    }

    async function act(kind) {
      busy = true;
      render();
      const args = { change_id: data.changeId, rules_version: rulesVersion };
      if (kind === "publish") args.review_token = data.reviewToken;
      try {
        const result = await app.callServerTool({ name: kind === "publish" ? "publish_changes" : "discard_change", arguments: args });
        const out = result.structuredContent || readText(result);
        busy = false;
        confirming = null;
        if (result.isError || !out || out.ok === false || out.error) {
          note = { kind: "error", text: (out && out.error) || (kind === "publish" ? "Publishing didn't work." : "Discarding didn't work.") };
        } else if (kind === "publish") {
          done = true;
          data.status = "published"; data.statusLabel = "Published";
          note = { kind: "success", text: "Published. The live site updates in a few minutes. It's saved in the change history and can be undone." };
        } else {
          done = true;
          data.status = "discarded"; data.statusLabel = "Discarded";
          note = { kind: "success", text: "Discarded. Nothing from this change will go live." };
        }
      } catch (e) {
        busy = false;
        confirming = null;
        note = { kind: "error", text: "That didn't work: " + (e && e.message ? e.message : "unknown error") };
      }
      render();
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

    const app = new App({ name: "ramprate-admin-ui", version: "3.0.0" }, {}, { autoResize: true });
    app.ontoolresult = function (params) {
      data = params.structuredContent || readText(params);
      rulesVersion = (params._meta && params._meta.rulesVersion) || null;
      confirming = null;
      busy = false;
      done = false;
      note = null;
      if (!data) {
        root.innerHTML = '<span class="muted">Couldn\\'t read the waiting changes. Ask again in the chat.</span>';
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
