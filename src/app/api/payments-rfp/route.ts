import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PAYMENTS_INDUSTRIES } from "@/lib/payments-advisory-data";

const DAILY_LIMIT = 30;
const BLOCK_AT_PERCENT = 0.95;

let callsToday = 0;
let counterDate = new Date().toISOString().slice(0, 10);

function resetIfNewDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== counterDate) {
    callsToday = 0;
    counterDate = today;
  }
}

const FALLBACK_MESSAGE =
  "We've reached our daily RFP preview limit. Your RampRate advisor will draft your RFP directly - no preview needed.";

export async function POST(req: NextRequest) {
  try {
    resetIfNewDay();

    if (callsToday >= Math.floor(DAILY_LIMIT * BLOCK_AT_PERCENT)) {
      return NextResponse.json({ rfp: FALLBACK_MESSAGE, limited: true });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        rfp: "RFP preview generation is not configured. Your RampRate advisor will draft your RFP directly.",
      });
    }

    const { formData } = (await req.json()) as { formData: Record<string, string> };
    const f = formData || {};
    const industry = PAYMENTS_INDUSTRIES.find((i) => i.label === f.industry);

    const prompt = `You are a senior payments consultant at RampRate A-Team Inc., a B Lab-certified strategic advisory firm that has brokered over $10B in enterprise technology transactions. You build long-term supplier relationships for enterprise merchants, not one-time transactions.

Generate a premium, board-level Request for Proposal (RFP) document for payment processing and gateway orchestration services. Format as structured markdown.

CLIENT PROFILE:
Company: ${f.companyName || "[Company Name]"}
Industry: ${f.industry || "N/A"}
Annual Revenue: $${f.annualRevenue || "N/A"}
Monthly Processing Volume: $${f.currentMonthlyVolume || "N/A"} current / $${f.projectedMonthlyVolume || "N/A"} projected
Average Ticket: $${f.avgTicketSize || industry?.avgTicket || "N/A"} | Highest: $${f.highestTicket || "N/A"}
Card Mix (Credit %): ${f.cardMixCredit || "N/A"}
Current Processor(s): ${f.currentProcessor || "N/A"} / ${f.secondaryProcessor || "none"}
Why Switching: ${f.switchReason || "N/A"}
Pain Points with Current Processor: ${f.painWithCurrent || "N/A"}
Chargeback Rate: ${f.chargebackRate || industry?.fraudRate || "N/A"} | Trend: ${f.chargebackTrend || "N/A"}
Fraud Tool: ${f.fraudToolCurrent || "N/A"}
PCI Status: ${f.pciCompliant || "N/A"} (${f.pciLevel || "N/A"})
Countries: ${f.countries || "USA"} | Currencies: ${f.currencies || "USD"}
Foreign Card %: ${f.foreignCardPercent || "N/A"}
Recurring Billing: ${f.recurringBilling || "N/A"}
Needs Orchestration: ${f.needsOrchestration || "N/A"} - Goal: ${f.orchestrationGoal || "N/A"}
Pricing Preference: ${f.pricingModel || "N/A"}
Contract Length: ${f.contractLength || "N/A"}
Switch Timeline: ${f.switchTimeline || "30-60 days"}
Partnership Priorities: ${f.partnershipPriorities || "N/A"}
Strategic Growth Plans: ${f.growthPlans || "N/A"}
Annual Review Cadence Preference: ${f.reviewCadence || "N/A"}
Additional Notes: ${f.additionalNotes || "None"}

Generate a complete RFP with these sections, each as a markdown "# " heading:
1. Executive Summary - company profile, strategic objectives, relationship goals (emphasize long-term partnership over price-only)
2. Scope of Services - gateway, acquiring, fraud, orchestration, recurring billing, international
3. Vendor Qualification Criteria - minimum thresholds to respond; disqualifiers
4. Technical Requirements - APIs, integrations, uptime SLAs, tokenization, orchestration architecture
5. Pricing & Commercial Requirements - rate format, reserve terms, early termination, annual review rights
6. Fraud & Risk Management Requirements - tools, 3DS2, chargeback ratios, dispute SLAs
7. Compliance & Security - PCI, AML, data residency, breach notification SLAs
8. Relationship & Service Requirements - dedicated account management, QBR cadence, escalation paths, SLA remedies
9. Evaluation Criteria & Weighted Scorecard - price 30%, service/relationship 25%, technical 25%, compliance 20%
10. Recommended Vendors to Solicit - 5-7 specific processors matched to this profile with brief rationale
11. RampRate Advisory Notes - strategic recommendations, red flags, negotiation leverage, 3-year value projection

Be specific with SLA numbers, rate benchmarks, and red flags. Emphasize that the client is selecting a long-term infrastructure partner, not a commodity vendor. This is a draft preview only - it will be refined by a RampRate advisor before distribution.`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    callsToday++;

    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const rfp =
      textBlock && textBlock.type === "text"
        ? textBlock.text
        : "We couldn't generate a preview right now. Your RampRate advisor will draft your RFP directly.";

    return NextResponse.json({ rfp });
  } catch {
    return NextResponse.json({ rfp: FALLBACK_MESSAGE, limited: true });
  }
}
