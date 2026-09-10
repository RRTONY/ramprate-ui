"use client";

import { useAuth } from "@/hooks/flow/useAuth";
import { Button } from "@/components/flow/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/flow/ui/card";
import {
  ArrowLeft,
  FileText,
  FolderTree,
  Inbox,
  Loader2,
  Plus,
  Save,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Resource = "posts" | "pages" | "categories" | "settings";
type SubmissionStatus = "new" | "reviewed" | "archived";
type ContentItem = {
  id: number;
  sourceId: string;
  slug?: string | null;
  route?: string | null;
  title?: string | null;
  section?: "blog" | "thinking";
  excerpt?: string | null;
  description?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  logoSourceId?: string | null;
  mainImageSourceId?: string | null;
  content?: unknown;
  body?: unknown;
};
type Submission = {
  id: number;
  formType: string;
  submitterEmail: string | null;
  sourceUrl: string | null;
  status: SubmissionStatus;
  payload: unknown;
  receivedAt: string;
};

const tabOptions = [
  { id: "posts", label: "Posts", Icon: FileText },
  { id: "pages", label: "Pages", Icon: FolderTree },
  { id: "categories", label: "Categories", Icon: Settings2 },
  { id: "settings", label: "Site settings", Icon: Settings2 },
  { id: "submissions", label: "Submissions", Icon: Inbox },
] as const;
type Tab = (typeof tabOptions)[number]["id"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function portableText(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text, index) => ({
      _key: `block-${index + 1}`,
      _type: "block",
      children: [{ _key: `span-${index + 1}`, _type: "span", text, marks: [] }],
      markDefs: [],
      style: "normal",
    }));
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok)
    throw new Error("The requested administrative action failed.");
  return response.json() as Promise<T>;
}

export default function AdminContentConsole() {
  const { user, loading, error: authError } = useAuth();
  const [tab, setTab] = useState<Tab>("posts");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [contentText, setContentText] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [route, setRoute] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState<"blog" | "thinking">("blog");
  const [categorySourceId, setCategorySourceId] = useState("");
  const [mainImageSourceId, setMainImageSourceId] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsAddress, setSettingsAddress] = useState("");
  const [logoSourceId, setLogoSourceId] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | SubmissionStatus>("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionWaitExpired, setSessionWaitExpired] = useState(false);

  const resource = tab === "submissions" ? null : (tab as Resource);

  useEffect(() => {
    if (!loading) return;
    const timeout = window.setTimeout(() => setSessionWaitExpired(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [loading]);

  const resetEditor = () => {
    setSelected(null);
    setTitle("");
    setSlug("");
    setRoute("");
    setExcerpt("");
    setDescription("");
    setContentText("");
    setSection("blog");
    setCategorySourceId("");
    setMainImageSourceId("");
    setSettingsEmail("");
    setSettingsPhone("");
    setSettingsAddress("");
    setLogoSourceId("");
  };

  const loadContent = async (nextResource: Resource) => {
    const data = await requestJson<{
      items?: ContentItem[];
      item?: ContentItem;
    }>(`/api/admin/content/${nextResource}`);
    setItems(data.items ?? (data.item ? [data.item] : []));
  };

  const loadSubmissions = async () => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (statusFilter) search.set("status", statusFilter);
    const data = await requestJson<{ items: Submission[] }>(
      `/api/admin/submissions?${search.toString()}`,
    );
    setSubmissions(data.items);
  };

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        if (tab === "submissions") {
          const data = await requestJson<{ items: Submission[] }>(
            "/api/admin/submissions",
          );
          setSubmissions(data.items);
        } else {
          const data = await requestJson<{
            items?: ContentItem[];
            item?: ContentItem;
          }>(`/api/admin/content/${tab}`);
          setItems(data.items ?? (data.item ? [data.item] : []));
          if (tab === "posts") {
            const data = await requestJson<{ items: ContentItem[] }>(
              "/api/admin/content/categories",
            );
            setCategories(data.items);
          }
        }
      } catch {
        setError(
          "Your administrator session could not load this data. Please sign in with an allowed administrator email.",
        );
      }
    };
    void load();
  }, [tab, user]);

  const editorTitle = useMemo(
    () =>
      selected ? `Edit ${tab.slice(0, -1)}` : `Create ${tab.slice(0, -1)}`,
    [selected, tab],
  );

  const selectItem = (item: ContentItem) => {
    setSelected(item);
    setTitle(item.title ?? "");
    setSlug(item.slug ?? "");
    setRoute(item.route ?? "");
    setExcerpt(item.excerpt ?? "");
    setDescription(item.description ?? "");
    setSection(item.section ?? "blog");
    setMainImageSourceId(item.mainImageSourceId ?? "");
    setSettingsEmail(item.email ?? "");
    setSettingsPhone(item.phone ?? "");
    setSettingsAddress(item.address ?? "");
    setLogoSourceId(item.logoSourceId ?? "");
    if (tab === "settings") setTitle(item.companyName ?? "");
    const blocks = (item.body ?? item.content) as
      Array<{ children?: Array<{ text?: string }> }> | undefined;
    setContentText(
      blocks
        ?.map(
          (block) =>
            block.children?.map((child) => child.text ?? "").join("") ?? "",
        )
        .join("\n\n") ?? "",
    );
  };

  const saveContent = async () => {
    if (!resource) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const safeSlug = slug || slugify(title);
    try {
      const payload =
        resource === "posts"
          ? {
              sourceId: selected?.sourceId,
              title,
              slug: safeSlug,
              section,
              excerpt: excerpt || null,
              body: portableText(contentText),
              mainImageSourceId: mainImageSourceId || null,
              categorySourceIds: categorySourceId ? [categorySourceId] : [],
            }
          : resource === "pages"
            ? {
                sourceId: selected?.sourceId,
                title: title || null,
                slug: safeSlug,
                route: route || `/${safeSlug}`,
                content: portableText(contentText),
              }
            : resource === "settings"
              ? {
                  companyName: title || null,
                  email: settingsEmail || null,
                  phone: settingsPhone || null,
                  address: settingsAddress || null,
                  logoSourceId: logoSourceId || null,
                }
              : {
                  sourceId: selected?.sourceId,
                  title,
                  slug: safeSlug,
                  description: description || null,
                };
      await requestJson(`/api/admin/content/${resource}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await loadContent(resource);
      resetEditor();
      setNotice("Saved to the managed content database.");
    } catch {
      setError(
        "The change could not be saved. Check the required fields and your administrator session.",
      );
    } finally {
      setBusy(false);
    }
  };

  const updateSubmissionStatus = async (
    id: number,
    status: SubmissionStatus,
  ) => {
    setBusy(true);
    setError(null);
    try {
      await requestJson("/api/admin/submissions", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
      });
      await loadSubmissions();
    } catch {
      setError("The submission status could not be updated.");
    } finally {
      setBusy(false);
    }
  };

  if (loading && !sessionWaitExpired) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center px-6 bg-slate-950 text-white">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold">Administrator access required</h1>
          <p className="text-slate-300">
            Sign in with your configured RampRate administrator email to
            continue.{" "}
            {authError || sessionWaitExpired
              ? "The external Flow session could not be reached just now."
              : ""}
          </p>
          <Link
            href="/flow/admin"
            className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"
          >
            <ArrowLeft className="size-4" /> Return to Flow admin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 space-y-6">
        <header className="flex flex-col gap-4 border-b border-sky-200/15 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-300">
              RampRate publishing
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Content & submissions
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage database-backed posts, pages and categories. Public form
              data is available only to authorized administrators.
            </p>
          </div>
          <Link
            href="/flow/admin"
            className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-white"
          >
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
        </header>

        <nav
          className="flex flex-wrap gap-2"
          aria-label="Content administration sections"
        >
          {tabOptions.map(({ id, label, Icon }) => (
            <Button
              key={id}
              type="button"
              variant={tab === id ? "default" : "outline"}
              onClick={() => {
                resetEditor();
                setError(null);
                setNotice(null);
                setSessionWaitExpired(false);
                setTab(id);
              }}
              className="gap-2"
            >
              <Icon className="size-4" /> {label}
            </Button>
          ))}
        </nav>

        {notice && (
          <p className="rounded-lg border border-emerald-300/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            {error}
          </p>
        )}

        {tab === "submissions" ? (
          <Card className="border-sky-100/10 bg-white text-slate-900">
            <CardHeader>
              <CardTitle>Private submission inbox</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search form data"
                  className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "" | SubmissionStatus)
                  }
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">All statuses</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="archived">Archived</option>
                </select>
                <Button
                  type="button"
                  onClick={() => void loadSubmissions()}
                  disabled={busy}
                >
                  Refresh
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3">Received</th>
                      <th className="p-3">Form</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-b align-top">
                        <td className="p-3 whitespace-nowrap">
                          {new Date(submission.receivedAt).toLocaleString()}
                        </td>
                        <td className="p-3">{submission.formType}</td>
                        <td className="p-3">
                          {submission.submitterEmail ?? "—"}
                        </td>
                        <td className="p-3 max-w-md">
                          <details>
                            <summary className="cursor-pointer text-sky-800">
                              View submission
                            </summary>
                            <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded bg-slate-100 p-3 text-xs">
                              {JSON.stringify(submission.payload, null, 2)}
                            </pre>
                          </details>
                        </td>
                        <td className="p-3">
                          <select
                            aria-label={`Status for submission ${submission.id}`}
                            value={submission.status}
                            disabled={busy}
                            onChange={(event) =>
                              void updateSubmissionStatus(
                                submission.id,
                                event.target.value as SubmissionStatus,
                              )
                            }
                            className="rounded border px-2 py-1 text-xs"
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {submissions.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                  No submissions match this inbox view.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
            <Card className="border-sky-100/10 bg-white text-slate-900">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="capitalize">{tab}</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetEditor}
                  className="gap-2"
                >
                  <Plus className="size-4" /> New
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {items.map((item) => (
                    <button
                      key={item.sourceId}
                      type="button"
                      onClick={() => selectItem(item)}
                      className="block w-full px-2 py-4 text-left hover:bg-sky-50"
                    >
                      <p className="font-semibold">{item.title ?? item.slug}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.route ?? item.slug ?? item.sourceId}
                      </p>
                    </button>
                  ))}
                </div>
                {items.length === 0 && (
                  <p className="py-10 text-center text-sm text-slate-500">
                    No {tab} found.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="border-sky-200/20 bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="capitalize">{editorTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="block text-sm">
                  {tab === "settings" ? "Company name" : "Title"}
                  <input
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      if (!slug) setSlug(slugify(event.target.value));
                    }}
                    className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                  />
                </label>
                {tab !== "settings" && (
                  <label className="block text-sm">
                    Slug
                    <input
                      value={slug}
                      onChange={(event) => setSlug(slugify(event.target.value))}
                      className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                    />
                  </label>
                )}
                {tab === "posts" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-sm">
                        Section
                        <select
                          value={section}
                          onChange={(event) =>
                            setSection(
                              event.target.value as "blog" | "thinking",
                            )
                          }
                          className="mt-1 w-full rounded-md border border-white/15 bg-slate-900 px-3 py-2"
                        >
                          <option value="blog">Blog</option>
                          <option value="thinking">Thinking</option>
                        </select>
                      </label>
                      <label className="text-sm">
                        Category
                        <select
                          value={categorySourceId}
                          onChange={(event) =>
                            setCategorySourceId(event.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-white/15 bg-slate-900 px-3 py-2"
                        >
                          <option value="">No category</option>
                          {categories.map((category) => (
                            <option
                              key={category.sourceId}
                              value={category.sourceId}
                            >
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="block text-sm">
                      Main image asset ID
                      <input
                        value={mainImageSourceId}
                        onChange={(event) =>
                          setMainImageSourceId(event.target.value)
                        }
                        placeholder="image-…"
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Excerpt
                      <textarea
                        value={excerpt}
                        onChange={(event) => setExcerpt(event.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                  </>
                )}
                {tab === "pages" && (
                  <label className="block text-sm">
                    Public route
                    <input
                      value={route}
                      onChange={(event) => setRoute(event.target.value)}
                      placeholder="/new-page"
                      className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                    />
                  </label>
                )}
                {tab === "categories" && (
                  <label className="block text-sm">
                    Description
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                    />
                  </label>
                )}
                {tab === "settings" && (
                  <>
                    <label className="block text-sm">
                      Email
                      <input
                        value={settingsEmail}
                        onChange={(event) =>
                          setSettingsEmail(event.target.value)
                        }
                        type="email"
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Phone
                      <input
                        value={settingsPhone}
                        onChange={(event) =>
                          setSettingsPhone(event.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Address
                      <textarea
                        value={settingsAddress}
                        onChange={(event) =>
                          setSettingsAddress(event.target.value)
                        }
                        rows={3}
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Logo asset ID
                      <input
                        value={logoSourceId}
                        onChange={(event) =>
                          setLogoSourceId(event.target.value)
                        }
                        placeholder="image-…"
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                  </>
                )}
                {tab !== "categories" && tab !== "settings" && (
                  <label className="block text-sm">
                    Content
                    <textarea
                      value={contentText}
                      onChange={(event) => setContentText(event.target.value)}
                      rows={12}
                      placeholder="Write in paragraphs. Each blank line becomes a content block."
                      className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                    />
                  </label>
                )}
                <Button
                  type="button"
                  onClick={() => void saveContent()}
                  disabled={busy || (tab === "settings" ? false : !title)}
                  className="w-full gap-2"
                >
                  <Save className="size-4" />{" "}
                  {busy ? "Saving…" : "Save to database"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
