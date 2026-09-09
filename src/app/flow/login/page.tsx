"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/flow/trpc";
import { signInSchema } from "@/lib/flow/auth-form-schemas";
import FlowAuthShell from "@/components/flow/FlowAuthShell";
import { Button } from "@/components/flow/ui/button";
import { Input } from "@/components/flow/ui/input";
import { Label } from "@/components/flow/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/flow/ui/card";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/flow";
  const utils = trpc.useUtils();

  const [error, setError] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signInSchema,
    onSubmit: async ({ email, password }) => {
      setError(null);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        toast.error("Invalid email or password.");
        return;
      }
      toast.success("Logged in successfully");
      // Fire-and-forget: a failure here must never block the redirect below,
      // since the hard reload already guarantees fresh auth state on its own.
      utils.auth.me.invalidate().catch(() => {});
      window.setTimeout(() => {
        window.location.href = redirect;
      }, 600);
    },
  });

  return (
    <FlowAuthShell
      eyebrow="Your Flow Circuit"
      title="Return to the signal."
      description="Continue mapping the invisible architecture that shapes how you and your team move together."
    >
      <Card className="w-full border-white/75 bg-white/85 shadow-[0_24px_70px_oklch(0.28_0.08_270/0.18)] backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                autoComplete="email"
                aria-invalid={Boolean(
                  formik.touched.email && formik.errors.email,
                )}
                aria-describedby={
                  formik.touched.email && formik.errors.email
                    ? "email-error"
                    : undefined
                }
              />
              {formik.touched.email && formik.errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/flow/forgot-password"
                  className="text-xs text-muted-foreground underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                autoComplete="current-password"
                aria-invalid={Boolean(
                  formik.touched.password && formik.errors.password,
                )}
                aria-describedby={
                  formik.touched.password && formik.errors.password
                    ? "password-error"
                    : undefined
                }
              />
              {formik.touched.password && formik.errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {formik.errors.password}
                </p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
              aria-busy={formik.isSubmitting}
            >
              {formik.isSubmitting && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              Sign in
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/flow/signup" className="underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </FlowAuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
