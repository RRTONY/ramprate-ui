import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const CMS_SESSION_COOKIE = "ramprate_cms_session";
export const CMS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const cmsSessionCookieOptions = {
  httpOnly: true,
  maxAge: CMS_SESSION_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function hashCmsSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createCmsSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function hashCmsPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyCmsPassword(
  password: string,
  storedHash: string | null,
): Promise<boolean> {
  if (!storedHash) return false;

  const [algorithm, salt, expectedHex] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  const expected = Buffer.from(expectedHex, "hex");
  if (expected.length !== 64) return false;

  const derived = (await scryptAsync(
    password,
    salt,
    expected.length,
  )) as Buffer;
  return timingSafeEqual(derived, expected);
}

export function getCmsSessionToken(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const entry = cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${CMS_SESSION_COOKIE}=`));
  if (!entry) return null;

  const token = entry.slice(CMS_SESSION_COOKIE.length + 1);
  return token || null;
}
