import { NextRequest, NextResponse } from "next/server";
import {
  NUAMINO_QUESTION_IDS,
  NUAMINO_SECTIONS,
} from "@/lib/nuamino-needs-fields";

const MAX_DESCRIPTION = 90000;

// Sam and Darryl each have a ClickUp automation that moves any task assigned
// to them into their own task list. Assigning the task itself would pull it out
// of the NuAmino list, so reviewers get an assigned comment instead.
const DEFAULT_LIST_ID = "901115645506";
const DEFAULT_REVIEWERS = "87464545,87423169";

function clean(value: unknown, limit = 300) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function describe(
  respondent: { name: string; email: string; title: string },
  answers: Record<string, unknown>,
  sourceUrl: string,
  receivedAt: string,
) {
  const lines = [
    "## Respondent",
    `- **Name:** ${respondent.name}`,
    `- **Email:** ${respondent.email}`,
    `- **Title:** ${respondent.title || "Not given"}`,
    `- **Received:** ${receivedAt}`,
  ];
  if (sourceUrl) lines.push(`- **Source:** ${sourceUrl}`);
  for (const section of NUAMINO_SECTIONS) {
    lines.push("", `## ${section.title}`);
    for (const question of section.questions) {
      const answer = clean(answers[question.id], 20000);
      const unchanged =
        !!question.understanding && answer === question.understanding.trim();
      lines.push(
        "",
        `**${question.label}**`,
        answer
          ? `${answer}${unchanged ? "\n_(Kept our existing understanding)_" : ""}`
          : "_No answer_",
      );
    }
  }
  const text = lines.join("\n");
  return text.length > MAX_DESCRIPTION
    ? text.slice(0, MAX_DESCRIPTION) + "\n\n_(Truncated: answers too long)_"
    : text;
}

async function clickUp(token: string, path: string, payload: unknown) {
  const response = await fetch(`https://api.clickup.com/api/v2/${path}`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`CU_${response.status}`);
  return (await response.json()) as { id?: string };
}

export async function POST(req: NextRequest) {
  const token = process.env.CLICKUP_API_TOKEN?.trim();
  const listId = process.env.NUAMINO_CLICKUP_LIST_ID?.trim() || DEFAULT_LIST_ID;
  const reviewers = (
    process.env.NUAMINO_CLICKUP_REVIEWERS?.trim() || DEFAULT_REVIEWERS
  )
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (
    !token ||
    !/^\d+$/.test(listId) ||
    reviewers.some((id) => !/^\d+$/.test(id))
  ) {
    console.error("NUAMINO_CLICKUP_CONFIG_INVALID");
    return NextResponse.json(
      { ok: false, error: "Questionnaire submissions are not configured yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid submission." },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid submission." },
      { status: 400 },
    );
  }
  const data = body as Record<string, unknown>;
  const respondent = data.respondent as Record<string, unknown> | undefined;
  const answers = data.answers as Record<string, unknown> | undefined;
  const verification = data.verification as Record<string, unknown> | undefined;
  if (
    !respondent ||
    typeof respondent.name !== "string" ||
    !respondent.name.trim() ||
    typeof respondent.email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(respondent.email) ||
    !answers ||
    typeof answers.stabilityTesting !== "string" ||
    !answers.stabilityTesting.trim() ||
    !verification ||
    typeof verification !== "object"
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Please provide your contact details and a direct stability-testing answer.",
      },
      { status: 400 },
    );
  }
  if (
    NUAMINO_QUESTION_IDS.some(
      (key) =>
        answers[key] !== undefined &&
        (typeof answers[key] !== "string" ||
          (answers[key] as string).length > 20000),
    )
  ) {
    return NextResponse.json(
      { ok: false, error: "Invalid answer format." },
      { status: 400 },
    );
  }

  const person = {
    name: clean(respondent.name, 150),
    email: clean(respondent.email, 254),
    title: clean(respondent.title, 150),
  };
  const meta = (data._meta as Record<string, unknown> | undefined) || {};
  const receivedAt = new Date().toISOString();
  let taskId: string | undefined;
  try {
    const task = await clickUp(token, `list/${listId}/task`, {
      name: `NuAmino needs analysis | ${person.name}${person.title ? ` | ${person.title}` : ""}`,
      markdown_description: describe(
        person,
        answers,
        clean(meta.sourceUrl, 500),
        receivedAt,
      ),
      notify_all: false,
    });
    taskId = task.id;
  } catch (error) {
    console.error(
      "NUAMINO_CLICKUP_TASK_FAILED",
      error instanceof Error ? error.message : "unknown",
    );
  }
  if (!taskId) {
    return NextResponse.json(
      { ok: false, error: "We could not save the submission. Please retry." },
      { status: 502 },
    );
  }
  await Promise.all(
    reviewers.map((id) =>
      clickUp(token, `task/${encodeURIComponent(taskId)}/comment`, {
        comment_text: `New NuAmino needs analysis from ${person.name} (${person.email}). Please review.`,
        assignee: Number(id),
        notify_all: false,
      }).catch((error) =>
        console.error(
          "NUAMINO_CLICKUP_COMMENT_FAILED",
          error instanceof Error ? error.message : "unknown",
        ),
      ),
    ),
  );
  return NextResponse.json({ ok: true });
}
