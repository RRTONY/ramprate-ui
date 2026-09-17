import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const peerAssessmentSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/flow/peer-assessment/PeerAssessmentClient.tsx",
  ),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Peer Assessment motion", () => {
  it("uses reduced-motion-safe CSS instead of Framer Motion for invite, question, answer, and completion feedback", () => {
    expect(peerAssessmentSource).not.toContain("framer-motion");
    expect(peerAssessmentSource).not.toContain("<motion.");
    expect(peerAssessmentSource).not.toContain("<AnimatePresence");
    expect(peerAssessmentSource).toContain("flow-peer-intro-enter");
    expect(peerAssessmentSource).toContain("flow-peer-complete-enter");
    expect(peerAssessmentSource).toContain("flow-peer-progress-bar");
    expect(peerAssessmentSource).toContain("flow-peer-question-enter");
    expect(peerAssessmentSource).toContain("flow-peer-answer-enter");
    expect(flowStyles).toContain("@keyframes flow-peer-question-enter");
    expect(flowStyles).toContain("@keyframes flow-peer-answer-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains anonymous invite retrieval, calculated progress, question handling, and review completion", () => {
    expect(peerAssessmentSource).toContain(
      "trpc.peerReview.getByToken.useQuery({ token }",
    );
    expect(peerAssessmentSource).toContain(
      "trpc.peerReview.complete.useMutation()",
    );
    expect(peerAssessmentSource).toContain(
      "((currentQuestionIndex + 1) / shuffledQuestions.length) * 100",
    );
    expect(peerAssessmentSource).toContain(
      "onClick={() => handleAnswer(option.text)}",
    );
    expect(peerAssessmentSource).toContain('type="button"');
    expect(peerAssessmentSource).toContain("reviewerName,");
    expect(peerAssessmentSource).toContain("perceivedRole: dominant.role");
    expect(peerAssessmentSource).toContain(
      'onSuccess: () => setPhase("complete")',
    );
  });
});
