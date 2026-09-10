import { NextRequest, NextResponse } from "next/server";
import {
  askRampRate,
  parseAdvisoryRequest,
  type AdvisoryRequest,
} from "@/lib/ai/rampRate";

const DAILY_LIMIT = 80;
let callsToday = 0;
let counterDate = new Date().toISOString().slice(0, 10);

function resetIfNewDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== counterDate) {
    callsToday = 0;
    counterDate = today;
  }
}

function capacityResponse(status = 429) {
  return NextResponse.json(
    {
      answer:
        "Ask RampRate is temporarily at capacity. Please try again shortly, or contact our principals for direct guidance.",
      contact: "/contact",
      limited: true,
    },
    { status },
  );
}

export async function POST(request: NextRequest) {
  resetIfNewDay();
  if (callsToday >= DAILY_LIMIT) return capacityResponse();

  let input: AdvisoryRequest;
  try {
    input = await parseAdvisoryRequest(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Please enter a question between 2 and 2,000 characters." },
      { status: 400 },
    );
  }

  try {
    callsToday += 1;
    const answer = await askRampRate(input);
    return NextResponse.json({ answer, source: "RampRate AI" });
  } catch {
    return capacityResponse(503);
  }
}
