import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin/access";
import { formSubmissions } from "@/lib/content/schema";

const submissionStatuses = ["new", "reviewed", "archived"] as const;
type SubmissionStatus = (typeof submissionStatuses)[number];

function parseStatus(value: unknown): SubmissionStatus | null {
  return submissionStatuses.includes(value as SubmissionStatus)
    ? (value as SubmissionStatus)
    : null;
}

function database() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for submission management.");
  }
  return drizzle(process.env.DATABASE_URL);
}

async function authorize(request: NextRequest) {
  const administrator = await getAuthorizedAdmin(request);
  return administrator
    ? null
    : NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
}

export async function GET(request: NextRequest) {
  const denied = await authorize(request);
  if (denied) return denied;
  const status = parseStatus(request.nextUrl.searchParams.get("status"));
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const db = database();
  const rows = await db
    .select()
    .from(formSubmissions)
    .where(status ? eq(formSubmissions.status, status) : undefined)
    .orderBy(desc(formSubmissions.receivedAt))
    .limit(100);

  const items = query
    ? rows.filter((row) =>
        [row.formType, row.submitterEmail, row.sourceUrl, JSON.stringify(row.payload)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : rows;
  return NextResponse.json({ items });
}

export async function PATCH(request: NextRequest) {
  const denied = await authorize(request);
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as {
    id?: unknown;
    status?: unknown;
  } | null;
  const status = parseStatus(body?.status);
  const id = typeof body?.id === "number" && Number.isInteger(body.id) && body.id > 0
    ? body.id
    : null;
  if (!status || !id) return NextResponse.json({ error: "Invalid submission update." }, { status: 400 });

  await database()
    .update(formSubmissions)
    .set({ status })
    .where(eq(formSubmissions.id, id));
  return NextResponse.json({ ok: true });
}
