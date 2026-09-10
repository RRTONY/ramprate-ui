"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/flow/ui/button";

type ResultGuidancePanelProps = {
  dominantRole: string;
  profileLabel: string;
  actionSteps: Array<{ title: string; body: string }>;
};

export default function ResultGuidancePanel({
  dominantRole,
  profileLabel,
  actionSteps,
}: ResultGuidancePanelProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const requestGuidance = async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `I completed the Flow Circuit assessment. My primary role is ${dominantRole} and my profile is ${profileLabel}. My current suggested steps are: ${actionSteps.map((step) => `${step.title}: ${step.body}`).join(" ")}. Give me three concise, practical next moves for the next seven days, with one short reflection question.`,
          history: [],
        }),
      });
      const payload = (await response.json()) as { answer?: unknown };
      if (!response.ok || typeof payload.answer !== "string") {
        throw new Error("Guidance was unavailable.");
      }
      setAnswer(payload.answer);
    } catch {
      setError(
        "Your tailored guidance is unavailable right now. Use the action steps above or try again shortly.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="rounded-2xl border border-sky-200 bg-linear-to-br from-sky-50 via-white to-blue-50 p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
            <Sparkles className="size-4" /> Ask RampRate AI
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Turn this result into a practical next step.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
            Generate a short, role-aware seven-day action plan from your result.
            This is reflection support, not professional medical, legal, tax, or investment advice.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => void requestGuidance()}
          disabled={pending}
          className="shrink-0 gap-2 bg-blue-700 text-white hover:bg-blue-800"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Generate next moves
        </Button>
      </div>
      {pending && (
        <p className="mt-4 text-sm font-medium text-blue-700" role="status" aria-live="polite">
          Preparing a focused answer…
        </p>
      )}
      {answer && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-white p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
          {answer}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
