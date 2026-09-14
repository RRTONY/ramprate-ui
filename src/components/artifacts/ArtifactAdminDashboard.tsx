"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Artifact } from "@/lib/artifacts";

type View = { name: "list" } | { name: "form"; artifact: Artifact | null };

function slugifyClient(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: Artifact["status"] }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        status === "published"
          ? "bg-[oklch(0.6_0.14_150/0.15)] text-[oklch(0.7_0.14_150)]"
          : "bg-white/10 text-white/50"
      }`}
    >
      {status}
    </span>
  );
}

function ArtifactActions({
  artifact,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  artifact: Artifact;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {artifact.status === "published" && (
        <Link
          href={`/artifacts/${artifact.slug}`}
          target="_blank"
          className="text-gold-light hover:underline"
        >
          View
        </Link>
      )}
      <button onClick={onEdit} className="text-gold-light hover:underline">
        Edit
      </button>
      <button
        onClick={onToggleStatus}
        className="text-gold-light hover:underline"
      >
        {artifact.status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button onClick={onDelete} className="text-red-400 hover:underline">
        Delete
      </button>
    </div>
  );
}

export default function ArtifactAdminDashboard() {
  const [view, setView] = useState<View>({ name: "list" });
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artifact | null>(null);
  // Bumped by actions that need to refresh the list without themselves
  // changing `view.name` (toggling status, deleting) - the effect below is
  // the single place that fetches, keeping the "what triggers a reload"
  // logic in its dependency array rather than calling a state-setting
  // helper directly from inside an effect (avoids cascading-render lint
  // issues and keeps this a plain "synchronize with the server" effect).
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (view.name !== "list") return;
    let cancelled = false;
    // Clearing the previous error is deferred into the async callback below
    // (not called synchronously here) - a literal setState call directly in
    // an effect's synchronous body trips react-hooks/set-state-in-effect,
    // even though this one is idempotent and harmless.
    fetch("/api/artifacts")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load artifacts.");
        if (cancelled) return;
        setListError(null);
        setArtifacts(data.artifacts);
      })
      .catch((e) => {
        if (!cancelled) {
          setListError(
            e instanceof Error ? e.message : "Failed to load artifacts.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [view.name, reloadToken]);

  async function toggleStatus(a: Artifact) {
    const nextStatus = a.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/artifacts/${a._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) setReloadToken((t) => t + 1);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/artifacts/${deleteTarget._id}`, {
      method: "DELETE",
    });
    setDeleteTarget(null);
    if (res.ok) setReloadToken((t) => t + 1);
  }

  if (view.name === "form") {
    return (
      <ArtifactForm
        artifact={view.artifact}
        onDone={() => setView({ name: "list" })}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1
          className="text-2xl sm:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Artifact Manager
        </h1>
        <button
          onClick={() => setView({ name: "form", artifact: null })}
          className="px-5 py-2.5 rounded-md text-sm font-bold bg-gold text-dark hover:opacity-90 transition-opacity"
        >
          + Create New Artifact
        </button>
      </div>

      {listError && <p className="text-red-400 text-sm mb-6">{listError}</p>}

      {artifacts === null && !listError && (
        <p className="text-white/50 text-sm">Loading…</p>
      )}

      {artifacts?.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/4 p-10 text-center">
          <p className="text-white/60 text-sm">
            No artifacts yet. Click &ldquo;Create New Artifact&rdquo; to publish
            your first one.
          </p>
        </div>
      )}

      {artifacts && artifacts.length > 0 && (
        <>
          {/* Desktop/tablet: table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="font-body font-semibold uppercase tracking-wide text-xs px-4 py-3">
                    Title
                  </th>
                  <th className="font-body font-semibold uppercase tracking-wide text-xs px-4 py-3">
                    Slug
                  </th>
                  <th className="font-body font-semibold uppercase tracking-wide text-xs px-4 py-3">
                    Status
                  </th>
                  <th className="font-body font-semibold uppercase tracking-wide text-xs px-4 py-3">
                    Created
                  </th>
                  <th className="font-body font-semibold uppercase tracking-wide text-xs px-4 py-3">
                    Updated
                  </th>
                  <th className="font-body font-semibold uppercase tracking-wide text-xs px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {artifacts.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {a.title}
                    </td>
                    <td className="px-4 py-3 text-white/50 font-mono text-xs">
                      /artifacts/{a.slug}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {formatDate(a._createdAt)}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {formatDate(a._updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <ArtifactActions
                        artifact={a}
                        onEdit={() => setView({ name: "form", artifact: a })}
                        onToggleStatus={() => toggleStatus(a)}
                        onDelete={() => setDeleteTarget(a)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-4">
            {artifacts.map((a) => (
              <div
                key={a._id}
                className="rounded-xl border border-white/10 bg-white/4 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-white font-medium">{a.title}</h3>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-white/50 font-mono text-xs mb-3 break-all">
                  /artifacts/{a.slug}
                </p>
                <p className="text-white/40 text-xs mb-4">
                  Created {formatDate(a._createdAt)} · Updated{" "}
                  {formatDate(a._updatedAt)}
                </p>
                <ArtifactActions
                  artifact={a}
                  onEdit={() => setView({ name: "form", artifact: a })}
                  onToggleStatus={() => toggleStatus(a)}
                  onDelete={() => setDeleteTarget(a)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
          <div className="max-w-sm w-full rounded-xl border border-white/10 bg-[#0d1117] p-6">
            <p className="text-white font-semibold mb-2">
              Delete this artifact?
            </p>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to permanently delete &ldquo;
              {deleteTarget.title}
              &rdquo;? This can&rsquo;t be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-md text-sm border border-white/20 text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-red-500/90 text-white hover:bg-red-500"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArtifactForm({
  artifact,
  onDone,
}: {
  artifact: Artifact | null;
  onDone: () => void;
}) {
  const isEdit = Boolean(artifact);
  const [title, setTitle] = useState(artifact?.title || "");
  const [slug, setSlug] = useState(artifact?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(artifact?.description || "");
  const [html, setHtml] = useState(artifact?.html || "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<{ slug: string } | null>(null);
  const originalSlug = artifact?.slug;

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyClient(value));
  }

  async function handleSubmit(publish: boolean) {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        slug,
        description,
        html,
        status: publish ? "published" : isEdit ? undefined : "draft",
      };
      const res = await fetch(
        isEdit ? `/api/artifacts/${artifact!._id}` : "/api/artifacts",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      if (publish) {
        setSuccess({ slug: data.slug || slug });
      } else {
        onDone();
      }
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    // Deliberately NOT hardcoded to https://ramprate.com - this same admin
    // UI runs on localhost, Netlify deploy previews, and production, and
    // an artifact published from a preview only actually exists (in a
    // reachable, deployed sense) on that preview's own domain until this
    // branch is merged. Pointing "View Artifact" at the real production
    // domain from a preview would 404 there even though the publish
    // genuinely succeeded - confirmed as the actual cause of a "my artifact
    // won't publish" report during this build (it had published; the link
    // just pointed at the wrong environment).
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = `/artifacts/${success.slug}`;
    const url = `${origin}${path}`;
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-[oklch(0.6_0.14_150/0.15)] flex items-center justify-center mx-auto mb-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="oklch(0.7 0.14 150)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2
          className="text-2xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Published successfully
        </h2>
        <p className="text-white/60 text-sm mb-2">Your artifact is live at:</p>
        <p className="font-mono text-sm text-gold-light mb-8 break-all">
          {url}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-md text-sm font-bold bg-gold text-dark hover:opacity-90 transition-opacity"
          >
            View Artifact
          </a>
          <button
            onClick={onDone}
            className="px-6 py-3 rounded-md text-sm font-semibold border border-white/20 text-white hover:bg-white/5"
          >
            Back to Artifact Manager
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <button
        onClick={onDone}
        className="text-white/50 hover:text-white text-sm mb-6"
      >
        ← Back
      </button>
      <h1
        className="text-2xl font-bold text-white mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {isEdit ? "Edit Artifact" : "Create New Artifact"}
      </h1>
      <p className="text-white/50 text-sm mb-8">
        Paste the HTML for your artifact below. Once published, it will be
        available at /artifacts/{slug || "your-slug"}.
      </p>

      <label className="block text-sm font-semibold text-white/70 mb-2">
        Artifact Title
      </label>
      <input
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Cloud Sourcing Assessment"
        className="w-full px-4 py-3 mb-5 rounded border border-white/20 bg-white/5 text-white text-sm focus:outline-none focus:border-(--gold)"
      />

      <label className="block text-sm font-semibold text-white/70 mb-2">
        URL Slug
      </label>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/40 text-sm font-mono shrink-0">
          /artifacts/
        </span>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(slugifyClient(e.target.value));
            setSlugTouched(true);
          }}
          placeholder="cloud-sourcing-assessment"
          className="w-full px-4 py-3 rounded border border-white/20 bg-white/5 text-white text-sm font-mono focus:outline-none focus:border-(--gold)"
        />
      </div>
      {isEdit && originalSlug && slug !== originalSlug && (
        <p className="text-amber-400 text-xs mb-5">
          Changing the slug changes the public URL. The old link ( /artifacts/
          {originalSlug}) will stop working.
        </p>
      )}
      {(!isEdit || slug === originalSlug) && <div className="mb-5" />}

      <label className="block text-sm font-semibold text-white/70 mb-2">
        Description{" "}
        <span className="text-white/40 font-normal">
          (optional, shown on the /artifacts listing)
        </span>
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full px-4 py-3 mb-5 rounded border border-white/20 bg-white/5 text-white text-sm focus:outline-none focus:border-(--gold) resize-y"
      />

      <label className="block text-sm font-semibold text-white/70 mb-2">
        HTML
      </label>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        rows={16}
        placeholder="<!DOCTYPE html>&#10;<html>&#10;...&#10;</html>"
        spellCheck={false}
        className="w-full px-4 py-3 mb-6 rounded border border-white/20 bg-black/30 text-white text-xs font-mono focus:outline-none focus:border-(--gold) resize-y"
      />

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="px-6 py-3 rounded-md text-sm font-bold bg-gold text-dark hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving
            ? "Publishing…"
            : isEdit
              ? "Update Artifact"
              : "Publish Artifact"}
        </button>
        {!isEdit && (
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-6 py-3 rounded-md text-sm font-semibold border border-white/20 text-white hover:bg-white/5 disabled:opacity-50"
          >
            Save as Draft
          </button>
        )}
        <button
          onClick={onDone}
          className="px-6 py-3 rounded-md text-sm font-semibold text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
