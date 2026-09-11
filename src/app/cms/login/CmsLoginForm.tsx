"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";

type LoginResponse = {
  error?: string;
  member?: { mustChangePassword?: boolean };
};

export default function CmsLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json().catch(() => ({}))) as LoginResponse;
      if (!response.ok) {
        setError(data.error ?? "CMS sign-in could not be completed.");
        return;
      }
      window.location.assign(
        data.member?.mustChangePassword ? "/cms/change-password" : "/cms",
      );
    } catch {
      setError("CMS sign-in could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0919] px-5 py-10 text-[#fffaf0] sm:grid sm:place-items-center">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-[#f4c85a]/20 bg-[#171025] p-7 shadow-2xl shadow-black/35 sm:p-9">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#f4c85a] transition-colors hover:text-[#fff0b8]"
        >
          <span aria-hidden="true">←</span> View RampRate site
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.24em] text-[#f4c85a]">
          RampRate CMS
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-white">
          Editorial access
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#d9d0dc]">
          Sign in to manage RampRate pages, insights, media metadata, SEO, and
          form submissions.
        </p>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="grid gap-2 text-sm font-medium text-[#f7f0f7]">
            Email address
            <span className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#f4c85a]"
              />
              <input
                autoComplete="email"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-10 py-3 text-white outline-none transition focus:border-[#f4c85a] focus:ring-2 focus:ring-[#f4c85a]/25"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#f7f0f7]">
            Password
            <span className="relative">
              <LockKeyhole
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#f4c85a]"
              />
              <input
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-10 py-3 text-white outline-none transition focus:border-[#f4c85a] focus:ring-2 focus:ring-[#f4c85a]/25"
                minLength={12}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </span>
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-300/25 bg-red-950/30 px-3 py-2 text-sm text-red-100"
            >
              {error}
            </p>
          )}
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4c85a] px-4 py-3 text-sm font-bold text-[#171025] transition hover:bg-[#ffe08a] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? "Signing in…" : "Sign in to CMS"}
            {!busy && <ArrowRight aria-hidden="true" className="size-4" />}
          </button>
        </form>
      </div>
    </main>
  );
}
