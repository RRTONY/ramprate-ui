"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArtifactAdminGate() {
  const router = useRouter();
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tryUnlock = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/artifacts-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: attempt }),
      });
      if (res.ok) {
        router.refresh();
      } else if (res.status === 429) {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "var(--dark)" }}
    >
      <div className="w-full max-w-sm">
        <div
          className="text-2xl font-bold mb-2 text-center text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Artifact Manager
        </div>
        <p
          className="text-sm text-center mb-8 text-white/60"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Internal tool for RampRate Sales & Marketing. Enter the admin password
          to continue.
        </p>
        <input
          type="password"
          value={attempt}
          onChange={(e) => {
            setAttempt(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") tryUnlock();
          }}
          placeholder="Password"
          autoComplete="off"
          className="w-full px-4 py-3 mb-3 rounded border-2 border-white/20 bg-white/5 text-white text-sm focus:outline-none focus:border-(--gold)"
          style={{ fontFamily: "var(--font-body)" }}
        />
        {error && (
          <p
            className="text-sm mb-3 text-red-400"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {error}
          </p>
        )}
        <button
          onClick={tryUnlock}
          disabled={loading}
          className="w-full py-3 rounded text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50 bg-gold text-dark"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </div>
    </main>
  );
}
