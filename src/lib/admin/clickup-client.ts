const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

const PRIORITY_MAP: Record<string, number> = {
  urgent: 1,
  high: 2,
  normal: 3,
  low: 4,
};

// Aliases for the lists seen in the "Technology & Web" space so callers
// don't have to remember raw ClickUp list IDs. A raw ID still works as-is
// since it won't match any of these keys.
export const CLICKUP_LIST_ALIASES: Record<string, string> = {
  "ramprate.com": "901114763476",
  requests: "901114763564",
  "tonygreenberg.com": "901114763560",
};

const DEFAULT_LIST_ID = CLICKUP_LIST_ALIASES.requests;

function resolveListId(listId?: string): string {
  if (!listId) return DEFAULT_LIST_ID;
  return CLICKUP_LIST_ALIASES[listId] ?? listId;
}

function authHeader(): string {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) throw new Error("CLICKUP_API_TOKEN is not configured");
  return token;
}

async function clickupFetch(path: string, init: RequestInit) {
  const res = await fetch(`${CLICKUP_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.err === "string"
        ? data.err
        : `ClickUp API error (${res.status})`,
    );
  }
  return data;
}

export interface ClickupTaskFields {
  name?: string;
  description?: string;
  priority?: "urgent" | "high" | "normal" | "low";
  dueDate?: string;
  status?: string;
}

export interface ClickupTaskResult {
  id: string;
  name: string;
  url: string;
  status: string;
}

function buildTaskBody(fields: ClickupTaskFields): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (fields.name !== undefined) body.name = fields.name;
  if (fields.description !== undefined) body.description = fields.description;
  if (fields.priority !== undefined)
    body.priority = PRIORITY_MAP[fields.priority];
  if (fields.status !== undefined) body.status = fields.status;
  if (fields.dueDate !== undefined) {
    const ms = Date.parse(fields.dueDate);
    if (!Number.isNaN(ms)) body.due_date = ms;
  }
  return body;
}

function toResult(data: Record<string, unknown>): ClickupTaskResult {
  const status = data.status as { status?: string } | undefined;
  return {
    id: String(data.id),
    name: String(data.name),
    url: String(data.url),
    status: status?.status ?? "",
  };
}

export async function createClickupTask(
  fields: ClickupTaskFields & { name: string; listId?: string },
): Promise<ClickupTaskResult> {
  const listId = resolveListId(fields.listId);
  const data = await clickupFetch(`/list/${listId}/task`, {
    method: "POST",
    body: JSON.stringify(buildTaskBody(fields)),
  });
  return toResult(data);
}

export async function updateClickupTask(
  taskId: string,
  fields: ClickupTaskFields,
): Promise<ClickupTaskResult> {
  const data = await clickupFetch(`/task/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(buildTaskBody(fields)),
  });
  return toResult(data);
}

export async function deleteClickupTask(taskId: string): Promise<void> {
  await clickupFetch(`/task/${taskId}`, { method: "DELETE" });
}
