import type { Metadata } from "next";
import Logo from "@/components/shared/Logo";
import { validateAuthorizeRequest } from "@/lib/admin/mcp-oauth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in to connect | RampRate",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  invalid: "That email and password don't match a RampRate team member.",
  locked: "Too many attempts. Wait 15 minutes, then try again.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function flat(
  params: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="md" />
        </div>
        <div className="glass-card p-6 sm:p-8">{children}</div>
        <p className="font-body text-xs text-white/40 text-center mt-6">
          RampRate team members only.
        </p>
      </div>
    </div>
  );
}

export default async function AuthorizePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = flat(await searchParams);

  const checked = q.invalid
    ? { error: q.invalid }
    : validateAuthorizeRequest(q);

  if ("error" in checked) {
    return (
      <Shell>
        <h1 className="font-display text-xl font-bold text-white mb-3">
          Can&apos;t sign in from this link
        </h1>
        <p className="font-body text-sm text-white/70 mb-2">{checked.error}</p>
        <p className="font-body text-sm text-white/50">
          Go back to ChatGPT or Claude and connect again from there.
        </p>
      </Shell>
    );
  }

  const error = q.error ? ERRORS[q.error] : undefined;
  const hidden = {
    response_type: "code",
    client_id: checked.params.clientId,
    redirect_uri: checked.params.redirectUri,
    state: checked.params.state,
    code_challenge: checked.params.codeChallenge,
    code_challenge_method: "S256",
    scope: checked.params.scope,
    resource: checked.params.resource,
  };

  return (
    <Shell>
      <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-gold">
        Sign in
      </span>
      <h1 className="font-display text-xl sm:text-2xl font-bold text-white mt-2 mb-2">
        Connect {checked.appName} to RampRate
      </h1>
      <p className="font-body text-sm text-white/60 mb-6">
        Sign in with your RampRate email to let {checked.appName} work on the
        website for you.
      </p>

      {error ? (
        <p
          role="alert"
          className="font-body text-sm rounded-md px-3 py-2 mb-4 bg-rust/15 text-white border border-rust/40"
        >
          {error}
        </p>
      ) : null}

      <form method="post" action="/api/oauth/authorize" className="space-y-4">
        {Object.entries(hidden).map(([name, value]) =>
          value ? (
            <input key={name} type="hidden" name={name} value={value} />
          ) : null,
        )}
        <div>
          <label
            htmlFor="email"
            className="font-body block text-sm font-medium text-white/80 mb-1.5"
          >
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            defaultValue={q.email ?? ""}
            placeholder="you@ramprate.com"
            className="font-body w-full rounded-md px-3 py-3 text-base bg-white/10 text-white placeholder:text-white/35 border border-white/15 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="font-body block text-sm font-medium text-white/80 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="font-body w-full rounded-md px-3 py-3 text-base bg-white/10 text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          className="font-body w-full rounded-md py-3 text-sm font-semibold bg-gold text-dark transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Sign in and connect
        </button>
      </form>
    </Shell>
  );
}
