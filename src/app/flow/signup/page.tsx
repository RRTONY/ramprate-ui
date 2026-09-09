"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/flow/trpc";
import { signUpSchema } from "@/lib/flow/auth-form-schemas";
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

export default function SignupPage() {
  const router = useRouter();
  const registerMutation = trpc.auth.register.useMutation();

  const [error, setError] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: signUpSchema,
    onSubmit: async ({ name, email, password }) => {
      setError(null);
      try {
        await registerMutation.mutateAsync({ name, email, password });
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError("Account created — please sign in.");
          router.push("/flow/login");
          return;
        }
        window.location.href = "/flow";
      } catch (caughtError: unknown) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to create account.",
        );
      }
    },
  });

  return (
    <FlowAuthShell
      eyebrow="Start with clarity"
      title="Find the pattern beneath the noise."
      description="Create your account to map individual energy, surface team friction, and turn insight into coordinated movement."
    >
      <Card className="w-full border-white/75 bg-white/85 shadow-[0_24px_70px_oklch(0.28_0.08_270/0.18)] backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                autoComplete="name"
                aria-invalid={Boolean(
                  formik.touched.name && formik.errors.name,
                )}
                aria-describedby={
                  formik.touched.name && formik.errors.name
                    ? "name-error"
                    : undefined
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {formik.errors.name}
                </p>
              )}
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                minLength={8}
                autoComplete="new-password"
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
              disabled={formik.isSubmitting || registerMutation.isPending}
              aria-busy={formik.isSubmitting || registerMutation.isPending}
            >
              {(formik.isSubmitting || registerMutation.isPending) && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              Sign up
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Already have an account?{" "}
            <Link href="/flow/login" className="underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </FlowAuthShell>
  );
}
