import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/admin/resend-client";

const allowedIntents = ["project", "introduction", "partnership", "other"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = (value: unknown, limit = 2000) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";
const list = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((v): v is string => typeof v === "string")
        .slice(0, 15)
        .map((v) => v.slice(0, 200))
    : [];

type ClickUpField = {
  id: string;
  name: string;
  type: string;
  type_config?: { options?: { id: string; name?: string; label?: string }[] };
};
type ClickUpTask = {
  id: string;
  date_created: string;
  status?: { status?: string };
  custom_fields?: { id?: string; name?: string; value?: unknown }[];
};
type ClickUpResponse = {
  id?: string;
  fields?: ClickUpField[];
  tasks?: ClickUpTask[];
  last_page?: boolean;
};
let connectFieldsCache:
  { listId: string; expires: number; fields: ClickUpField[] } | undefined;
const intentLabels: Record<string, string> = {
  project: "Seeking help (project or business)",
  introduction: "Introducing someone",
  partnership: "Proposing a partnership",
  other: "Other inquiry",
};
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const connectLog = (code: string, time: string) => console.warn(code, time);

function clickUpSubmission(body: Record<string, unknown>, receivedAt: string) {
  const details = object(body.details);
  const introduced = object(details.introduced_person);
  const rawEvent = text(body.event_tag, 60).toLowerCase();
  const event = /^[a-z0-9 _-]{1,60}$/.test(rawEvent) ? rawEvent : "";
  const date = Date.parse(text(body.submitted_at, 100));
  const submitted = Number.isFinite(date) && date >= 0 ? date : null;
  const pacific = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "long",
  }).format(new Date(submitted ?? receivedAt));
  const lines = (entries: [string, string][]) =>
    entries
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");
  const sections: [string, string][] = [
    [
      "CONTACT",
      lines([
        ["Name", text(body.name, 100)],
        ["Company", text(body.company, 150)],
        ["Email", text(body.email, 254)],
        ["Phone", text(body.phone, 30)],
        ["Role", text(body.role, 100)],
        ["Contact preference", text(body.contact_preference)],
        ["Intent", intentLabels[text(body.intent)] || text(body.intent)],
        ["Event", text(body.event_tag, 60)],
        ["Heard from", text(body.heard_from, 200)],
        ["Consent", body.consent === true ? "Yes" : ""],
      ]),
    ],
    ["OVERVIEW", text(body.overview, 2000)],
    ["DESIRED OUTCOME", text(details.desired_outcome, 300)],
    ["STAGE", text(details.stage)],
    ["NEEDS", list(body.needs).join(", ")],
    ["TIMING", text(body.timing)],
    [
      "INTRODUCED PERSON",
      lines([
        ["Name", text(introduced.name, 100)],
        ["Company", text(introduced.company, 150)],
        ["Contact", text(introduced.contact, 150)],
        ["How they know them", text(introduced.relationship, 300)],
        ["Knows about the introduction", text(details.person_knows)],
      ]),
    ],
    ["PARTNERSHIP TYPES", list(details.partnership_types).join(", ")],
    [
      "WHO TO REACH",
      lines([
        ["Requested contact", text(details.wants_to_reach, 300)],
        ["RampRate contact", text(details.rampate_contact, 150)],
        ["Worked with RampRate before", text(details.worked_with_us_before)],
      ]),
    ],
    ["AGREED", text(details.person_knows)],
    ["SUBMITTED", pacific],
    ["SOURCE PAGE", text(body.source_page)],
    ["FORM URL", text(body.form_url)],
  ];
  const displayEvent = event.replace(
    /(^|[ _-])([a-z])/g,
    (_, separator, letter) => separator + letter.toUpperCase(),
  );
  const intent = text(body.intent);
  const titleIntent =
    intent === "project" ? "Seeking help" : intentLabels[intent];
  const values: [string, string | string[] | number | null][] = [
    ["Company", text(body.company, 150)],
    ["Contact preference", text(body.contact_preference)],
    ["Email", text(body.email, 254)],
    ["Event", event],
    ["Heard from", text(body.heard_from, 200)],
    ["Intent", intentLabels[intent]],
    ["Needs", list(body.needs)],
    ["Partnership types", list(details.partnership_types)],
    ["Phone", text(body.phone, 30).replace(/[ .()\-]/g, "")],
    ["Role", text(body.role, 100)],
    ["Source page", text(body.source_page)],
    ["Stage", text(details.stage)],
    ["Submitted at", submitted],
    ["Timing", text(body.timing)],
  ];
  return {
    name: `${displayEvent || "Direct"} | ${titleIntent} | ${text(body.name, 100)} | ${text(body.company, 150)}`
      .slice(0, 199)
      .replace(/[\uD800-\uDBFF]$/, ""),
    event,
    pacific,
    values,
    description: sections
      .filter(([, value]) => value)
      .map(([heading, value]) => `${heading}\n${value}`)
      .join("\n\n"),
  };
}

type ClickUpResult = { ok: boolean; code?: string };
function clickUpFailureCode(error: unknown, stage: string) {
  const message = error instanceof Error ? error.message : "";
  const status = /^CU_HTTP_(\d{3})$/.exec(message)?.[1];
  if (status === "401") return "CU_UNAUTHORIZED_401";
  if (status === "403") return "CU_NO_ACCESS_403";
  if (status === "404" && stage !== "CU_TASK_UPDATE_FAILED")
    return "CU_LIST_NOT_FOUND_404";
  if (status === "429") return "CU_RATE_LIMIT_429";
  if (message === "CU_TIMEOUT") return "CU_TIMEOUT";
  if (message === "CU_NETWORK") return "CU_NETWORK_FAILED";
  return status ? `${stage}_${status}` : stage;
}

async function saveConnectToClickUp(
  body: Record<string, unknown>,
  receivedAt: string,
): Promise<ClickUpResult> {
  const token =
    process.env.CLICKUP_CONNECT_TOKEN?.trim() ||
    process.env.CLICKUP_API_TOKEN?.trim();
  if (!token) {
    connectLog("CU_TOKEN_MISSING", receivedAt);
    return { ok: false, code: "CU_TOKEN_MISSING" };
  }
  const listId = process.env.CLICKUP_CONNECT_LIST_ID?.trim() || "901115639111";
  const assigneeText =
    process.env.CLICKUP_CONNECT_ASSIGNEE?.trim() || "87423169";
  // "none" skips assignment: a ClickUp automation moves any task assigned to
  // Darryl out of Inbound Connect into his own list, dropping its fields.
  const unassigned = assigneeText.toLowerCase() === "none";
  const assignee = Number(assigneeText);
  if (
    !/^\d+$/.test(listId) ||
    (!unassigned &&
      (!/^\d+$/.test(assigneeText) ||
        !Number.isSafeInteger(assignee) ||
        assignee <= 0))
  ) {
    connectLog("CU_CONFIG_INVALID", receivedAt);
    return { ok: false, code: "CU_CONFIG_INVALID" };
  }
  const submission = clickUpSubmission(body, receivedAt);
  const controller = new AbortController();
  const deadline = Date.now() + 8000;
  let stage = "CU_FIELD_LOOKUP_FAILED";
  const failure = (code: string) => new Error(code);
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const expired = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      controller.abort();
      reject(failure("CU_TIMEOUT"));
    }, 8000);
  });
  async function request(
    path: string,
    method = "GET",
    payload?: unknown,
  ): Promise<ClickUpResponse> {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (controller.signal.aborted || Date.now() >= deadline)
        throw failure("CU_TIMEOUT");
      let response: Response;
      try {
        response = await fetch(`https://api.clickup.com/api/v2/${path}`, {
          method,
          headers: {
            Authorization: token!,
            "Content-Type": "application/json",
          },
          ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
          signal: controller.signal,
          cache: "no-store",
          redirect: "error",
        });
      } catch {
        throw failure(controller.signal.aborted ? "CU_TIMEOUT" : "CU_NETWORK");
      }
      if (
        (response.status === 429 || response.status >= 500) &&
        attempt === 0
      ) {
        const retryAfter = response.headers.get("retry-after");
        const reset = Number(response.headers.get("x-ratelimit-reset"));
        const delay =
          retryAfter !== null
            ? /^\d+(\.\d+)?$/.test(retryAfter)
              ? Number(retryAfter) * 1000
              : Math.max(0, Date.parse(retryAfter) - Date.now())
            : reset > 0
              ? Math.max(0, reset * 1000 - Date.now())
              : 250;
        const wait = Number.isFinite(delay) ? delay : 250;
        if (wait >= deadline - Date.now()) {
          controller.abort();
          throw failure(`CU_HTTP_${response.status}`);
        }
        await response.body?.cancel();
        await new Promise<void>((resolve, reject) => {
          const cancel = () => {
            clearTimeout(timer);
            reject(failure("CU_TIMEOUT"));
          };
          const timer = setTimeout(() => {
            controller.signal.removeEventListener("abort", cancel);
            resolve();
          }, wait);
          controller.signal.addEventListener("abort", cancel, { once: true });
        });
        continue;
      }
      if (response.status === 429) controller.abort();
      if (!response.ok) throw failure(`CU_HTTP_${response.status}`);
      try {
        return (await response.json()) as ClickUpResponse;
      } catch {
        throw failure("CU_RESPONSE");
      }
    }
    throw failure("CU_RETRY");
  }
  async function work() {
    let fields: ClickUpField[] = [];
    if (
      connectFieldsCache?.listId === listId &&
      connectFieldsCache.expires > Date.now()
    ) {
      fields = connectFieldsCache.fields;
    } else {
      try {
        const response = await request(`list/${listId}/field`);
        if (!Array.isArray(response.fields))
          throw failure("CU_FIELDS_RESPONSE");
        fields = response.fields.filter(
          (field) =>
            field &&
            typeof field.id === "string" &&
            typeof field.name === "string",
        );
        connectFieldsCache = {
          listId,
          fields,
          expires: Date.now() + 5 * 60 * 1000,
        };
      } catch (error) {
        if (controller.signal.aborted) throw error;
        connectLog(clickUpFailureCode(error, stage), receivedAt);
      }
    }
    const customFields: {
      id: string;
      value: string | string[] | number;
      value_options?: { time: boolean };
    }[] = [];
    for (const [name, raw] of submission.values) {
      if (
        raw === null ||
        raw === "" ||
        (Array.isArray(raw) && raw.length === 0)
      )
        continue;
      const field = fields.find((field) => field.name === name);
      const codeName = name.replace(/ /g, "_");
      if (!field) {
        connectLog(`CU_FIELD_MISSING_${codeName}`, receivedAt);
        continue;
      }
      let value: string | string[] | number = raw;
      if (field.type === "drop_down" || field.type === "labels") {
        const labels = Array.isArray(raw) ? raw : [String(raw)];
        const options = Array.isArray(field.type_config?.options)
          ? field.type_config.options
          : [];
        const ids = labels.map(
          (label) =>
            options.find(
              (option) =>
                (option.name || option.label || "").trim().toLowerCase() ===
                label.trim().toLowerCase(),
            )?.id,
        );
        if (ids.some((id) => !id)) {
          connectLog(`CU_OPTION_UNMATCHED_${codeName}`, receivedAt);
          continue;
        }
        value =
          field.type === "labels" ? [...new Set(ids as string[])] : ids[0]!;
      } else if (field.type === "date") {
        if (typeof raw !== "number") continue;
      } else if (
        !["short_text", "text", "email", "phone", "url"].includes(field.type) ||
        typeof raw !== "string"
      ) {
        connectLog(`CU_FIELD_TYPE_${codeName}`, receivedAt);
        continue;
      }
      if (field.type === "url") {
        try {
          if (!["https:", "http:"].includes(new URL(String(value)).protocol))
            continue;
        } catch {
          continue;
        }
      }
      customFields.push({
        id: field.id,
        value,
        ...(field.type === "date" ? { value_options: { time: true } } : {}),
      });
    }
    let duplicate: ClickUpTask | undefined;
    stage = "CU_DUPLICATE_CHECK_FAILED";
    try {
      const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const emailId = fields.find((field) => field.name === "Email")?.id;
      for (let page = 0; ; page++) {
        const query = new URLSearchParams({
          include_closed: "true",
          include_timl: "true",
          date_created_gt: String(since),
          page: String(page),
        });
        const response = await request(`list/${listId}/task?${query}`);
        if (!Array.isArray(response.tasks)) throw failure("CU_TASKS_RESPONSE");
        duplicate = response.tasks.find(
          (task) =>
            Number(task.date_created) >= since &&
            Number(task.date_created) <= Date.now() &&
            task.custom_fields?.some(
              (field) =>
                ((emailId && field.id === emailId) || field.name === "Email") &&
                typeof field.value === "string" &&
                field.value.trim().toLowerCase() ===
                  text(body.email, 254).toLowerCase(),
            ),
        );
        if (
          duplicate ||
          response.last_page === true ||
          response.tasks.length < 100
        )
          break;
      }
    } catch (error) {
      if (controller.signal.aborted) throw error;
      connectLog(clickUpFailureCode(error, stage), receivedAt);
    }
    if (duplicate) {
      stage = "CU_TASK_UPDATE_FAILED";
      const id = encodeURIComponent(duplicate.id);
      await request(`task/${id}/comment`, "POST", {
        comment_text: `New submission\n${submission.pacific}\n\n${submission.description}`,
        notify_all: false,
      });
      if (
        ["not a fit", "moved to crm"].includes(
          duplicate.status?.status?.trim().toLowerCase() || "",
        )
      ) {
        await request(`task/${id}`, "PUT", { status: "New" });
      }
      connectLog("CU_DUPLICATE_MERGED", receivedAt);
      return;
    }
    stage = "CU_TASK_CREATE_FAILED";
    const task = await request(`list/${listId}/task`, "POST", {
      name: submission.name,
      description: submission.description,
      status: "New",
      assignees: unassigned ? [] : [assignee],
      tags: submission.event ? [submission.event] : [],
      custom_fields: customFields,
    });
    if (!task.id) throw failure("CU_RESPONSE");
  }
  try {
    await Promise.race([work(), expired]);
    return { ok: true };
  } catch (error) {
    const code = clickUpFailureCode(error, stage);
    connectLog(code, receivedAt);
    return { ok: false, code };
  } finally {
    if (timeout) clearTimeout(timeout);
    controller.abort();
  }
}

export async function POST(req: NextRequest) {
  const contentType = req.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return new Response(
      '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connect with RampRate</title><p>This form needs JavaScript. Please email <a href="mailto:hello@ramprate.com">hello@ramprate.com</a> instead.</p><a href="/connect">Return to Connect</a></html>',
      {
        status: 400,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  const maxBodyBytes = 20 * 1024;
  const tooLarge = () =>
    NextResponse.json(
      { ok: false, error: "Form data must be 20 KB or smaller." },
      { status: 413 },
    );
  if (Number(req.headers.get("content-length") || 0) > maxBodyBytes)
    return tooLarge();
  let body: Record<string, unknown>;
  try {
    const reader = req.body?.getReader();
    if (!reader) throw new Error("empty");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        return tooLarge();
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("invalid");
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 },
    );
  }
  if (body.website) return NextResponse.json({ ok: true });
  const name = text(body.name, 100);
  const email = text(body.email, 254);
  const company = text(body.company, 150);
  const overview = text(body.overview, 2000);
  const intent = text(body.intent, 30);
  const details =
    body.details &&
    typeof body.details === "object" &&
    !Array.isArray(body.details)
      ? (body.details as Record<string, unknown>)
      : {};
  const introduced =
    details.introduced_person && typeof details.introduced_person === "object"
      ? (details.introduced_person as Record<string, unknown>)
      : {};
  const limitedFields: [string, unknown, number][] = [
    ["name", body.name, 100],
    ["email", body.email, 254],
    ["company", body.company, 150],
    ["role", body.role, 100],
    ["phone", body.phone, 30],
    ["overview", body.overview, 2000],
    ["intro_name", introduced.name, 100],
    ["intro_org", introduced.company, 150],
    ["intro_contact", introduced.contact, 150],
    ["intro_how", introduced.relationship, 300],
    ["outcome", details.desired_outcome, 300],
    ["prior_who", details.rampate_contact, 150],
    ["reach", details.wants_to_reach, 300],
    ["heard", body.heard_from, 200],
  ];
  for (const [field, value, limit] of limitedFields) {
    if (typeof value === "string" && value.length > limit) {
      return NextResponse.json(
        { ok: false, error: `${field} must be ${limit} characters or fewer.` },
        { status: 400 },
      );
    }
  }
  const phone = text(body.phone);
  if (
    phone &&
    (!/^\+?[0-9 .()\-]+$/.test(phone) ||
      !/^[0-9]{7,15}$/.test(phone.replace(/[ .()\-]/g, "").replace(/^\+/, "")))
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please enter a valid phone number, or leave it blank.",
      },
      { status: 400 },
    );
  }
  if (
    !name ||
    !emailPattern.test(email) ||
    !company ||
    !overview ||
    !allowedIntents.includes(intent) ||
    body.consent !== true ||
    (intent === "introduction" && !text(introduced.name, 150))
  ) {
    return NextResponse.json(
      { ok: false, error: "Please complete all required fields." },
      { status: 400 },
    );
  }
  const receivedAt = new Date().toISOString();
  const fields = [
    ["Inquiry type", intent],
    ["Name", name],
    ["Email", email],
    ["Company or project", company],
    ["Role", text(body.role)],
    ["Phone", text(body.phone)],
    ["Overview", overview],
    ["Needs", list(body.needs).join(", ")],
    ["Timing", text(body.timing)],
    ["How they heard about us", text(body.heard_from)],
    ["Event", text(body.event_tag)],
    ["Preferred contact", text(body.contact_preference)],
    ["Project stage", text(details.stage)],
    ["Desired outcome", text(details.desired_outcome)],
    ["Introduced person's name", text(introduced.name)],
    ["Introduced person's company", text(introduced.company)],
    ["Introduced person's contact", text(introduced.contact)],
    ["How they know them", text(introduced.relationship)],
    ["Introduced person knows", text(details.person_knows)],
    ["Partnership types", list(details.partnership_types).join(", ")],
    ["Previously worked with RampRate", text(details.worked_with_us_before)],
    ["RampRate contact", text(details.rampate_contact)],
    ["Requested contact", text(details.wants_to_reach)],
    ["Received at", new Date().toISOString()],
  ].filter(([, value]) => value);
  const message = fields.map(([key, value]) => key + ": " + value).join("\n\n");
  const clickUpSaved = await saveConnectToClickUp(body, receivedAt);
  const emailText = clickUpSaved.ok
    ? message
    : `ClickUp save failed - please add this lead manually [${clickUpSaved.code}]\n\n` +
      message +
      "\n\nSource page: " +
      text(body.source_page) +
      "\nForm URL: " +
      text(body.form_url) +
      "\nSubmitted at: " +
      text(body.submitted_at, 100) +
      "\nConsent: Yes";
  try {
    await Promise.all(
      ["admin@ramprate.com", "hello@ramprate.com"].map((to) =>
        sendEmail({
          to,
          subject:
            "New RampRate Connect Inquiry - " +
            name.replace(/[\r\n]/g, " ") +
            " - " +
            intent,
          text: emailText,
        }),
      ),
    );
  } catch {
    console.error("CONNECT_EMAIL_FAILED", receivedAt);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send your inquiry. Please email hello@ramprate.com.",
      },
      { status: 502 },
    );
  }
  return NextResponse.json(
    { ok: true },
    process.env.CONTEXT === "deploy-preview" ||
      /^deploy-preview-\d+--ramprate\.netlify\.app$/.test(
        new URL(req.url).hostname,
      )
      ? { headers: { "X-Connect-ClickUp": clickUpSaved.code || "SAVED" } }
      : undefined,
  );
}
