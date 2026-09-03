"use client";

import { useEffect, useState } from "react";

// Adobe Sign embedded widget for the Champion Agreement. The agreement is
// already signed on RampRate's side, so this is the countersignature step.
const SIGN_WIDGET_URL =
  "https://ramprate.na1.echosign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhCVAqhSrsx7DliZShggf5WdlczVF_RyHcX1_Axrk9mQApyL6_BzCN60id2cvtn_iwc*";

const PRACTICE_OPTIONS = [
  { value: "startups", label: "Startups and founders" },
  { value: "sourcing", label: "Enterprise technology sourcing" },
  { value: "biochain", label: "Biologics and peptide sourcing" },
  { value: "web3", label: "Web3 and blockchain" },
  { value: "ngo", label: "NGOs and foundations" },
  { value: "tokenization", label: "Assets for tokenization" },
  { value: "funds", label: "Venture funds" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontSize: "16px",
  color: "var(--champion-ink)",
  padding: "12px 14px",
  border: "1px solid var(--champion-line-strong)",
  borderRadius: "8px",
  background: "var(--champion-paper)",
  fontFamily: "var(--font-body)",
};

export default function ChampionApplyForm() {
  const [mode, setMode] = useState<"form" | "signing">("form");
  const [cameFromForm, setCameFromForm] = useState(false);
  const [practices, setPractices] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  // Warm introductions are sent straight to /champions#sign by Tony or Rob.
  // Those people have already had the conversation, so the intake questions
  // would just be asking them things they have already answered.
  useEffect(() => {
    function syncFromHash() {
      if (window.location.hash === "#sign") {
        setMode("signing");
      }
    }
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function togglePractice(value: string) {
    setPractices((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/champions-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            name: data.get("name"),
            email: data.get("email"),
            company: data.get("company"),
            linkedin: data.get("linkedin"),
            practices,
            signer: data.get("signer"),
            notes: data.get("notes"),
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Submission failed.");
      }

      setStatus("idle");
      setCameFromForm(true);
      setMode("signing");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please email hello@ramprate.com.",
      );
    }
  }

  if (mode === "signing") {
    return (
      <div id="sign" className="scroll-mt-24">
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "var(--champion-paper)",
            border: "1px solid var(--champion-line)",
          }}
        >
          {cameFromForm && (
            <p
              className="mb-5 rounded-lg px-4 py-3 text-[15px] leading-relaxed"
              style={{
                background: "var(--champion-faint)",
                color: "var(--champion-ink)",
                fontFamily: "var(--font-body)",
              }}
            >
              Your details are saved and timestamped. One signature left.
            </p>
          )}

          <h3
            className="text-xl font-bold"
            style={{
              color: "var(--champion-ink)",
              fontFamily: "var(--font-display)",
            }}
          >
            Champion Agreement
          </h3>
          <p
            className="mt-2 mb-5 text-[15px] leading-relaxed"
            style={{
              color: "var(--champion-body)",
              fontFamily: "var(--font-body)",
            }}
          >
            Already signed on our side. Add your details, sign, and you get a
            countersigned copy by email straight away.
          </p>

          <iframe
            src={SIGN_WIDGET_URL}
            title="RampRate Champion Agreement"
            className="w-full rounded-lg"
            style={{
              height: "900px",
              border: "1px solid var(--champion-line)",
              background: "var(--champion-paper)",
            }}
          />

          <p
            className="mt-4 text-sm leading-relaxed"
            style={{
              color: "var(--champion-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            If the agreement does not load, or you would rather sign on a full
            screen,{" "}
            <a
              href={SIGN_WIDGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "var(--champion)" }}
            >
              open it in a new tab
            </a>
            . Questions first? Email{" "}
            <a
              href="mailto:hello@ramprate.com"
              style={{ color: "var(--champion)" }}
            >
              hello@ramprate.com
            </a>
            .
          </p>

          {!cameFromForm && (
            <p
              className="mt-4 pt-4 text-sm leading-relaxed"
              style={{
                borderTop: "1px solid var(--champion-line)",
                color: "var(--champion-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              New to us?{" "}
              <button
                type="button"
                onClick={() => setMode("form")}
                className="font-semibold hover:underline"
                style={{
                  color: "var(--champion)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Tell us about yourself first
              </button>{" "}
              so we know who to route your introductions to.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="sign" className="scroll-mt-24">
      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background: "var(--champion-paper)",
          border: "1px solid var(--champion-line)",
        }}
      >
        <p
          className="mb-6 text-[15px] leading-relaxed"
          style={{
            color: "var(--champion-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Already spoke to us?{" "}
          <button
            type="button"
            onClick={() => setMode("signing")}
            className="font-semibold hover:underline"
            style={{
              color: "var(--champion)",
              fontFamily: "var(--font-body)",
            }}
          >
            Skip ahead and sign
          </button>
          .
        </p>

        <form onSubmit={handleSubmit}>
          {[
            {
              id: "name",
              label: "Your name",
              type: "text",
              autoComplete: "name",
              required: true,
            },
            {
              id: "email",
              label: "Work email",
              type: "email",
              autoComplete: "email",
              required: true,
            },
            {
              id: "company",
              label: "Company",
              type: "text",
              autoComplete: "organization",
              required: true,
            },
            {
              id: "linkedin",
              label: "LinkedIn profile",
              type: "url",
              placeholder: "https://linkedin.com/in/",
              required: true,
            },
          ].map((field) => (
            <div key={field.id} className="mb-5">
              <label
                htmlFor={field.id}
                className="block text-[15px] font-semibold mb-1.5"
                style={{
                  color: "var(--champion-ink)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                required={field.required}
                style={inputStyle}
              />
            </div>
          ))}

          <div className="mb-5">
            <span
              className="block text-[15px] font-semibold"
              style={{
                color: "var(--champion-ink)",
                fontFamily: "var(--font-body)",
              }}
            >
              Which of these could you introduce
            </span>
            <span
              className="block text-sm mt-0.5"
              style={{
                color: "var(--champion-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Select as many as apply. This decides who picks up your first
              referral.
            </span>
            <div className="grid gap-2 mt-2.5">
              {PRACTICE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 text-[15px] transition-colors"
                  style={{
                    border: `1px solid ${
                      practices.includes(option.value)
                        ? "var(--champion)"
                        : "var(--champion-line)"
                    }`,
                    color: "var(--champion-body)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <input
                    type="checkbox"
                    name="practices"
                    value={option.value}
                    checked={practices.includes(option.value)}
                    onChange={() => togglePractice(option.value)}
                    className="mt-1 shrink-0"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="signer"
              className="block text-[15px] font-semibold"
              style={{
                color: "var(--champion-ink)",
                fontFamily: "var(--font-body)",
              }}
            >
              Who signs on your side
            </label>
            <span
              className="block text-sm mt-0.5 mb-1.5"
              style={{
                color: "var(--champion-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Name and email, if it is not you. Leave blank if you are signing.
            </span>
            <input id="signer" name="signer" type="text" style={inputStyle} />
          </div>

          <div className="mb-6">
            <label
              htmlFor="notes"
              className="block text-[15px] font-semibold"
              style={{
                color: "var(--champion-ink)",
                fontFamily: "var(--font-body)",
              }}
            >
              Anything we should know
            </label>
            <span
              className="block text-sm mt-0.5 mb-1.5"
              style={{
                color: "var(--champion-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Optional. If you already have someone in mind, tell us here.
            </span>
            <input id="notes" name="notes" type="text" style={inputStyle} />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg px-8 py-4 text-[17px] font-semibold text-white transition-opacity disabled:opacity-60"
            style={{
              background: "var(--champion)",
              fontFamily: "var(--font-body)",
            }}
          >
            {status === "sending" ? "Saving" : "Continue to the agreement"}
          </button>

          {status === "error" && (
            <p
              className="mt-3 text-sm"
              style={{
                color: "var(--champion-dark)",
                fontFamily: "var(--font-body)",
              }}
            >
              {error}
            </p>
          )}

          <p
            className="mt-4 text-sm leading-relaxed"
            style={{
              color: "var(--champion-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            We do not share your details. The agreement opens on the next step,
            already signed on our side, and you can read it in full before
            signing anything.
          </p>
        </form>
      </div>
    </div>
  );
}
