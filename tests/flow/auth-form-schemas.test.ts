import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  signInSchema,
  signUpSchema,
} from "../../src/lib/flow/auth-form-schemas";

describe("Flow credential form schemas", () => {
  it("accepts a valid returning-user submission and rejects an invalid email", async () => {
    await expect(
      signInSchema.validate({
        email: "member@example.com",
        password: "secure-password",
      }),
    ).resolves.toEqual({
      email: "member@example.com",
      password: "secure-password",
    });

    await expect(
      signInSchema.validate({
        email: "not-an-email",
        password: "secure-password",
      }),
    ).rejects.toMatchObject({ errors: ["Enter a valid email address."] });
  });

  it("requires a name and a minimum eight-character password for account creation", async () => {
    await expect(
      signUpSchema.validate({
        name: "Avery Client",
        email: "avery@example.com",
        password: "secure-password",
      }),
    ).resolves.toEqual({
      name: "Avery Client",
      email: "avery@example.com",
      password: "secure-password",
    });

    await expect(
      signUpSchema.validate({
        name: "",
        email: "avery@example.com",
        password: "short",
      }),
    ).rejects.toMatchObject({ errors: ["Use at least 8 characters."] });
  });
});

describe("Flow credential pending states", () => {
  it("uses the shared Lucide spinner instead of textual ellipses", async () => {
    const root = new URL("../..", import.meta.url);
    const [loginSource, signupSource] = await Promise.all([
      readFile(new URL("src/app/flow/login/page.tsx", root), "utf8"),
      readFile(new URL("src/app/flow/signup/page.tsx", root), "utf8"),
    ]);

    for (const source of [loginSource, signupSource]) {
      expect(source).toContain('import { Loader2 } from "lucide-react";');
      expect(source).toContain('className="size-4 animate-spin"');
      expect(source).not.toMatch(/(?:Signing in|Creating account)\.\.\./);
    }
  });
});
