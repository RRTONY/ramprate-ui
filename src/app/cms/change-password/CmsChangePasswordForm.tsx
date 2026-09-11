"use client";

import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";
import { FormEvent, useState } from "react";

type PasswordResponse = { error?: string };

export default function CmsChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmation) {
      setError("The new password and confirmation must match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/cms/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as PasswordResponse;
      if (!response.ok) {
        setError(data.error ?? "Your CMS password could not be updated.");
        return;
      }
      window.location.assign("/cms");
    } catch {
      setError("Your CMS password could not be updated. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0919] px-5 py-10 text-[#fffaf0] sm:grid sm:place-items-center">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-[#f4c85a]/20 bg-[#171025] p-7 shadow-2xl shadow-black/35 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4c85a]">
          RampRate CMS
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-white">
          Set a new password
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#d9d0dc]">
          Your temporary password must be replaced before you can manage
          RampRate content.
        </p>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          {[
            [
              "Current temporary password",
              currentPassword,
              setCurrentPassword,
              "current-password",
            ],
            ["New password", newPassword, setNewPassword, "new-password"],
            [
              "Confirm new password",
              confirmation,
              setConfirmation,
              "new-password",
            ],
          ].map(([label, value, setValue, autoComplete]) => (
            <label
              key={label as string}
              className="grid gap-2 text-sm font-medium text-[#f7f0f7]"
            >
              {label as string}
              <span className="relative">
                <KeyRound
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#f4c85a]"
                />
                <input
                  autoComplete={autoComplete as string}
                  className="w-full rounded-xl border border-white/15 bg-black/20 px-10 py-3 text-white outline-none transition focus:border-[#f4c85a] focus:ring-2 focus:ring-[#f4c85a]/25"
                  minLength={12}
                  onChange={(event) =>
                    (setValue as (value: string) => void)(event.target.value)
                  }
                  required
                  type="password"
                  value={value as string}
                />
              </span>
            </label>
          ))}
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
            {busy ? "Saving password…" : "Save new password"}
            {!busy && <ArrowRight aria-hidden="true" className="size-4" />}
          </button>
        </form>
        <Link
          href="/cms/login"
          className="mt-5 inline-block text-sm text-[#f4c85a] hover:text-[#fff0b8]"
        >
          Return to CMS sign in
        </Link>
      </div>
    </main>
  );
}
