import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { invokeBuiltInCompletion } from "@/lib/ai/rampRate";
import { PAYMENTS_INDUSTRIES } from "@/lib/payments-advisory-data";

const DAILY_LIMIT = 30;
let callsToday = 0;
let counterDate = new Date().toISOString().slice(0, 10);

const rfpRequestSchema = yup.object({
  formData: yup
    .object()
    .test("field-values", "Form values must be text.", (value) =>
      Object.values(value ?? {}).every((field) => typeof field === "string"),
    )
    .required(),
});

const FALLBACK_MESSAGE =
  "We could not generate the RFP preview right now. Your RampRate advisor will draft the RFP directly.";

function resetIfNewDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== counterDate) {
    callsToday = 0;
    counterDate = today;
  }
}

export async function POST(request: NextRequest) {
  resetIfNewDay();
  if (callsToday >= DAILY_LIMIT) {
    return NextResponse.json({ rfp: FALLBACK_MESSAGE, limited: true }, { status: 429 });
  }

  let formData: Record<string, string>;
  try {
    ({ formData } = await rfpRequestSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    }));
  } catch {
    return NextResponse.json(
      { error: "A complete payment profile is required to generate an RFP preview." },
      { status: 400 },
    );
  }

  const industry = PAYMENTS_INDUSTRIES.find(
    (entry) => entry.label === formData.industry,
  );
  const prompt = `Generate a premium, board-level Request for Proposal draft for payment processing and gateway orchestration. This is a preview to be reviewed by a RampRate advisor before distribution. Format in structured markdown with these H1 sections: Executive Summary; Scope of Services; Supplier Qualification Criteria; Technical Requirements; Pricing & Commercial Requirements; Fraud & Risk Management Requirements; Compliance & Security; Relationship & Service Requirements; Evaluation Criteria & Weighted Scorecard; Recommended Suppliers to Solicit; RampRate Advisory Notes.

Client profile: Company ${formData.companyName || "not provided"}; Industry ${formData.industry || "not provided"}; Revenue ${formData.annualRevenue || "not provided"}; Monthly volume ${formData.currentMonthlyVolume || "not provided"}; Projected volume ${formData.projectedMonthlyVolume || "not provided"}; Average ticket ${formData.avgTicketSize || industry?.avgTicket || "not provided"}; Current processor ${formData.currentProcessor || "not provided"}; Switching rationale ${formData.switchReason || "not provided"}; Chargeback rate ${formData.chargebackRate || industry?.fraudRate || "not provided"}; Countries ${formData.countries || "USA"}; Currencies ${formData.currencies || "USD"}; Orchestration goal ${formData.orchestrationGoal || "not provided"}; Contract length ${formData.contractLength || "not provided"}; Timeline ${formData.switchTimeline || "30-60 days"}; Additional notes ${formData.additionalNotes || "none"}.

Be clear about assumptions. Do not present rate benchmarks, regulatory rules, or supplier capabilities as verified facts unless supported by the submitted profile. Emphasize long-term supplier relationship and include review prompts for a qualified advisor.`;

  try {
    callsToday += 1;
    const rfp = await invokeBuiltInCompletion({
      system:
        "You are a senior payment infrastructure consultant. Produce careful, practical RFP drafts. Avoid legal, tax, or investment advice and identify assumptions for human review.",
      messages: [{ role: "user", content: prompt }],
      maxCompletionTokens: 4_000,
    });
    return NextResponse.json({ rfp });
  } catch {
    return NextResponse.json({ rfp: FALLBACK_MESSAGE, limited: true }, { status: 503 });
  }
}
