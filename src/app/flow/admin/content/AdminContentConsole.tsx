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
  ImageIcon,
  Inbox,
  Plus,
  Save,
  SearchCheck,
  Settings2,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Resource = "posts" | "pages" | "categories" | "settings" | "seo" | "media";
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
  imageSourceId?: string | null;
  altText?: string | null;
  url?: string | null;
  metadata?: unknown;
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
  { id: "seo", label: "Page SEO", Icon: SearchCheck },
  { id: "media", label: "Media metadata", Icon: ImageIcon },
  { id: "submissions", label: "Submissions", Icon: Inbox },
] as const;
const memberTabOption = {
  id: "members",
  label: "CMS team",
  Icon: UsersRound,
} as const;
type Tab = (typeof tabOptions)[number]["id"] | typeof memberTabOption.id;

type CmsMember = {
  id: number;
  email: string;
  role: "owner" | "admin" | "editor";
  isActive: number;
  invitedByEmail: string | null;
};

type AdminContentConsoleProps = {
  apiBase?: "/api/admin" | "/api/cms";
  includeMemberManagement?: boolean;
  returnHref?: string;
  returnLabel?: string;
};

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

export default function AdminContentConsole({
  apiBase = "/api/admin",
  includeMemberManagement = false,
  returnHref = "/flow/admin",
  returnLabel = "Dashboard",
}: AdminContentConsoleProps) {
  const { user, error: authError } = useAuth();
  const [tab, setTab] = useState<Tab>("posts");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [members, setMembers] = useState<CmsMember[]>([]);
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
  const [mediaSourceId, setMediaSourceId] = useState("");
  const [jsonLdText, setJsonLdText] = useState("{}");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | SubmissionStatus>("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<CmsMember["role"]>("editor");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resource =
    tab === "submissions" || tab === "members" ? null : (tab as Resource);
  const availableTabs = includeMemberManagement
    ? [...tabOptions, memberTabOption]
    : tabOptions;

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
    setMediaSourceId("");
    setJsonLdText("{}");
  };

  const loadContent = async (nextResource: Resource) => {
    const data = await requestJson<{
      items?: ContentItem[];
      item?: ContentItem;
    }>(`${apiBase}/content/${nextResource}`);
    setItems(data.items ?? (data.item ? [data.item] : []));
  };

  const loadSubmissions = async () => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (statusFilter) search.set("status", statusFilter);
    const data = await requestJson<{ items: Submission[] }>(
      `${apiBase}/submissions?${search.toString()}`,
    );
    setSubmissions(data.items);
  };

  const loadMembers = useCallback(async () => {
    const data = await requestJson<{ items: CmsMember[] }>(
      `${apiBase}/members`,
    );
    setMembers(data.items);
  }, [apiBase]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        if (tab === "members") {
          await loadMembers();
        } else if (tab === "submissions") {
          const data = await requestJson<{ items: Submission[] }>(
            `${apiBase}/submissions`,
          );
          setSubmissions(data.items);
        } else {
          const data = await requestJson<{
            items?: ContentItem[];
            item?: ContentItem;
          }>(`${apiBase}/content/${tab}`);
          setItems(data.items ?? (data.item ? [data.item] : []));
          if (tab === "posts") {
            const data = await requestJson<{ items: ContentItem[] }>(
              `${apiBase}/content/categories`,
            );
            setCategories(data.items);
          }
        }
      } catch {
        setError(
          "Your CMS session could not load this data. Sign in with an active RampRate CMS team email.",
        );
      }
    };
    void load();
  }, [apiBase, loadMembers, tab, user]);

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
    setDescription(item.altText ?? item.description ?? "");
    setSection(item.section ?? "blog");
    setMainImageSourceId(item.mainImageSourceId ?? "");
    setSettingsEmail(item.email ?? "");
    setSettingsPhone(item.phone ?? "");
    setSettingsAddress(item.address ?? "");
    setLogoSourceId(item.logoSourceId ?? "");
    setMediaSourceId(item.sourceId ?? "");
    setMainImageSourceId(item.imageSourceId ?? item.mainImageSourceId ?? "");
    const metadata = item.metadata as Record<string, unknown> | undefined;
    setJsonLdText(JSON.stringify(metadata?.jsonLd ?? {}, null, 2));
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
      let jsonLd: unknown = {};
      if (resource === "seo") {
        try {
          jsonLd = JSON.parse(jsonLdText || "{}");
        } catch {
          setError("JSON-LD must be valid JSON before it can be saved.");
          return;
        }
      }
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
              : resource === "seo"
                ? {
                    sourceId: selected?.sourceId,
                    route: route || "/",
                    title,
                    description,
                    imageSourceId: mainImageSourceId || null,
                    jsonLd,
                  }
                : resource === "media"
                  ? {
                      sourceId: mediaSourceId || selected?.sourceId,
                      title,
                      altText: description,
                    }
                  : {
                      sourceId: selected?.sourceId,
                      title,
                      slug: safeSlug,
                      description: description || null,
                    };
      await requestJson(`${apiBase}/content/${resource}`, {
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
      await requestJson(`${apiBase}/submissions`, {
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

  const saveMember = async () => {
    if (!memberEmail.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await requestJson(`${apiBase}/members`, {
        method: "POST",
        body: JSON.stringify({ email: memberEmail, role: memberRole }),
      });
      setMemberEmail("");
      setMemberRole("editor");
      await loadMembers();
      setNotice("CMS team access updated.");
    } catch {
      setError("The CMS team member could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const updateMember = async (
    member: CmsMember,
    update: Pick<CmsMember, "role" | "isActive">,
  ) => {
    setBusy(true);
    setError(null);
    try {
      await requestJson(`${apiBase}/members`, {
        method: "PATCH",
        body: JSON.stringify({ id: member.id, ...update }),
      });
      await loadMembers();
      setNotice("CMS team access updated.");
    } catch {
      setError(
        "The CMS team member could not be updated. Keep at least one active owner.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center px-6 bg-slate-950 text-white">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold">RampRate CMS access required</h1>
          <p className="text-slate-300">
            Sign in with an active RampRate CMS team email to continue.{" "}
            {authError
              ? "The shared sign-in session could not be reached just now."
              : ""}
          </p>
          <Link
            href="/flow/login?redirect=%2Fcms"
            className="inline-flex items-center rounded-md bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-200"
          >
            Sign in to RampRate CMS
          </Link>
          <Link
            href={returnHref}
            className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"
          >
            <ArrowLeft className="size-4" /> {returnLabel}
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
            href={returnHref}
            className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-white"
          >
            <ArrowLeft className="size-4" /> {returnLabel}
          </Link>
        </header>

        <nav
          className="flex flex-wrap gap-2"
          aria-label="Content administration sections"
        >
          {availableTabs.map(({ id, label, Icon }) => (
            <Button
              key={id}
              type="button"
              variant={tab === id ? "default" : "outline"}
              onClick={() => {
                resetEditor();
                setError(null);
                setNotice(null);
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

        {tab === "members" ? (
          <Card className="border-sky-100/10 bg-white text-slate-900">
            <CardHeader>
              <CardTitle>CMS team access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="max-w-2xl text-sm text-slate-600">
                Owners can add, reactivate, change, or deactivate CMS members.
                Editors and administrators may manage content, while only owners
                can manage this access list.
              </p>
              <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_10rem_auto]">
                <input
                  value={memberEmail}
                  onChange={(event) => setMemberEmail(event.target.value)}
                  type="email"
                  placeholder="team@ramprate.com"
                  className="rounded-md border bg-white px-3 py-2 text-sm"
                />
                <select
                  value={memberRole}
                  onChange={(event) =>
                    setMemberRole(event.target.value as CmsMember["role"])
                  }
                  className="rounded-md border bg-white px-3 py-2 text-sm"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
                <Button
                  type="button"
                  onClick={() => void saveMember()}
                  disabled={busy || !memberEmail.trim()}
                >
                  Add member
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Granted by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b align-middle">
                        <td className="p-3 font-medium">{member.email}</td>
                        <td className="p-3">
                          <select
                            aria-label={`Role for ${member.email}`}
                            value={member.role}
                            disabled={busy}
                            onChange={(event) =>
                              void updateMember(member, {
                                role: event.target.value as CmsMember["role"],
                                isActive: member.isActive,
                              })
                            }
                            className="rounded border px-2 py-1 text-xs"
                          >
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              void updateMember(member, {
                                role: member.role,
                                isActive: member.isActive === 1 ? 0 : 1,
                              })
                            }
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${member.isActive === 1 ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}
                          >
                            {member.isActive === 1 ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-3 text-slate-500">
                          {member.invitedByEmail ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : tab === "submissions" ? (
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
                  {tab === "settings"
                    ? "Company name"
                    : tab === "seo"
                      ? "SEO title"
                      : tab === "media"
                        ? "Image title"
                        : "Title"}
                  <input
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      if (
                        tab !== "settings" &&
                        tab !== "seo" &&
                        tab !== "media" &&
                        !slug
                      ) {
                        setSlug(slugify(event.target.value));
                      }
                    }}
                    className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                  />
                </label>
                {tab !== "settings" && tab !== "seo" && tab !== "media" && (
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
                {tab === "seo" && (
                  <>
                    <label className="block text-sm">
                      Public route
                      <input
                        value={route}
                        onChange={(event) => setRoute(event.target.value)}
                        placeholder="/about"
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Meta description
                      <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Social image asset ID
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
                      JSON-LD
                      <textarea
                        value={jsonLdText}
                        onChange={(event) => setJsonLdText(event.target.value)}
                        rows={9}
                        spellCheck={false}
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs"
                      />
                    </label>
                  </>
                )}
                {tab === "media" && (
                  <>
                    <label className="block text-sm">
                      Media asset ID
                      <input
                        value={mediaSourceId}
                        onChange={(event) =>
                          setMediaSourceId(event.target.value)
                        }
                        placeholder="image-…"
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Descriptive alternative text
                      <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2"
                      />
                    </label>
                  </>
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
                {tab !== "categories" &&
                  tab !== "settings" &&
                  tab !== "seo" &&
                  tab !== "media" && (
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
                  disabled={
                    busy ||
                    (tab === "settings"
                      ? false
                      : tab === "media"
                        ? !title || !description || !mediaSourceId
                        : !title)
                  }
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
