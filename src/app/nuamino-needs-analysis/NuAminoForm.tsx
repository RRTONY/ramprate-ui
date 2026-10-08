"use client";

import { useState } from "react";
import Logo from "@/components/shared/Logo";
import { NUAMINO_SECTIONS } from "@/lib/nuamino-needs-fields";

type ResponseMap = Record<string, string>;
type VerifyMap = Record<string, string>;

export function NuAminoForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ResponseMap>(() =>
    Object.fromEntries(
      NUAMINO_SECTIONS.flatMap((section) =>
        section.questions
          .filter(
            (question) => question.understanding && section.id !== "stability",
          )
          .map((question) => [question.id, question.understanding || ""]),
      ),
    ),
  );
  const verification: VerifyMap = {};
  const [respondent, setRespondent] = useState({
    name: "",
    email: "",
    title: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [error, setError] = useState("");
  const section = NUAMINO_SECTIONS[step];
  const last = step === NUAMINO_SECTIONS.length - 1;

  async function submit() {
    if (!respondent.name.trim() || !/^\S+@\S+\.\S+$/.test(respondent.email)) {
      setError("Enter your name and a valid email before submitting.");
      setStep(0);
      return;
    }
    if (!answers.stabilityTesting?.trim()) {
      setError(
        "Please provide a direct response to the stability testing question.",
      );
      setStep(2);
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/nuamino-needs-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respondent,
          answers,
          verification,
          _meta: {
            submittedAt: new Date().toISOString(),
            sourceUrl: window.location.href,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || "Submission failed.");
      setStatus("done");
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof Error
          ? caught.message
          : "Submission failed. Please try again.",
      );
    }
  }

  function navigate(next: number) {
    setStep(next);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (status === "done") {
    return (
      <div className="apf-root">
        <div className="apf-success-view">
          <h1>Thank you. Your responses have been received.</h1>
          <p>
            RampRate will review your answers and follow up on any
            clarifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="apf-root">
      <div className="apf-app">
        <aside className="apf-rail">
          <div className="apf-logo-mark">
            <Logo variant="dark" size="sm" />
          </div>
          <p className="apf-rail-heading">
            NuAmino needs analysis, prepared by RampRate. Seven focused parts,
            with prefilled answers you can edit where needed.
          </p>
          <ol className="apf-steps" aria-label="Questionnaire progress">
            {NUAMINO_SECTIONS.map((part, index) => (
              <li
                key={part.id}
                className={`apf-step-item ${index === step ? "is-active" : ""} ${index < step ? "is-done" : ""}`}
                aria-current={index === step ? "step" : undefined}
              >
                <button
                  type="button"
                  className="apf-step-btn"
                  onClick={() => navigate(index)}
                  aria-label={`Go to ${part.title}`}
                >
                  <span className="apf-step-badge">{index + 1}</span>
                  <span className="apf-step-text flex min-w-0 flex-col gap-3">
                    <span className="apf-step-title block leading-snug">
                      {part.title}
                    </span>
                    <span className="apf-step-sub block !mt-0 leading-relaxed">
                      {part.questions.length} questions
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="apf-rail-footer">
            We have filled in what we already know. Simply edit anything that
            needs updating.
          </p>
        </aside>
        <main className="apf-main">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (last) void submit();
              else navigate(step + 1);
            }}
          >
            <section className="apf-panel">
              <div className="apf-panel-eyebrow">
                Part {step + 1} of {NUAMINO_SECTIONS.length} · NuAmino needs
                analysis
              </div>
              <h1>{section.title}</h1>
              <p className="apf-panel-intro">
                {section.subtitle}.{" "}
                {section.id === "gtm"
                  ? "Please provide as much detail as possible to help us understand your customer base, channel priorities and growth objectives."
                  : "We have prefilled some answers based on information you have already shared with us. Please review them and update anything that needs correcting. The more detail you can provide, the better we can understand your business and priorities."}
              </p>
              {step === 0 && (
                <div className="apf-section-block">
                  <h3>About you</h3>
                  <div className="apf-field-grid">
                    <div className="apf-field">
                      <label htmlFor="na-name">Name *</label>
                      <input
                        id="na-name"
                        type="text"
                        required
                        value={respondent.name}
                        onChange={(e) =>
                          setRespondent((v) => ({ ...v, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="apf-field">
                      <label htmlFor="na-email">Email *</label>
                      <input
                        id="na-email"
                        type="email"
                        required
                        value={respondent.email}
                        onChange={(e) =>
                          setRespondent((v) => ({
                            ...v,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="apf-field">
                      <label htmlFor="na-title">Title / role (optional)</label>
                      <input
                        id="na-title"
                        type="text"
                        value={respondent.title}
                        onChange={(e) =>
                          setRespondent((v) => ({
                            ...v,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
              {section.questions.map((question) => (
                <div className="apf-section-block" key={question.id}>
                  <div className="apf-field">
                    <label htmlFor={`na-${question.id}`}>
                      {question.label}
                      {question.id === "stabilityTesting" ? " *" : ""}
                    </label>
                    <textarea
                      id={`na-${question.id}`}
                      rows={4}
                      required={question.id === "stabilityTesting"}
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        setAnswers((v) => ({
                          ...v,
                          [question.id]: e.target.value,
                        }))
                      }
                      placeholder="Your response…"
                    />
                  </div>
                </div>
              ))}
            </section>
            {error && (
              <p role="alert" className="apf-error-text">
                {error}
              </p>
            )}
            <div className="apf-nav-bar">
              <button
                type="button"
                className="apf-btn apf-btn-ghost"
                disabled={step === 0 || status === "submitting"}
                onClick={() => navigate(step - 1)}
              >
                Back
              </button>
              <span className="apf-nav-progress">
                {step + 1} / {NUAMINO_SECTIONS.length}
              </span>
              <button
                type="submit"
                className="apf-btn apf-btn-primary"
                disabled={status === "submitting"}
              >
                {status === "submitting"
                  ? "Submitting…"
                  : last
                    ? "Submit questionnaire"
                    : "Next section"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
