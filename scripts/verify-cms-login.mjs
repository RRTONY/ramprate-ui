import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const [email] = process.argv.slice(2);
if (!email) {
  console.error("Usage: node scripts/verify-cms-login.mjs <member-email>");
  process.exit(1);
}

const prompts = createInterface({ input, output });
const password = await prompts.question("CMS password: ");
prompts.close();

const baseUrl = process.env.CMS_TEST_BASE_URL ?? "http://127.0.0.1:3000";
const login = await fetch(`${baseUrl}/api/cms/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
if (!login.ok) {
  console.error(`CMS login verification failed with HTTP ${login.status}.`);
  process.exit(1);
}

const cookie = login.headers.get("set-cookie")?.split(";")[0];
if (!cookie) {
  console.error("CMS login verification did not receive a session cookie.");
  process.exit(1);
}

const session = await fetch(`${baseUrl}/api/cms/auth/session`, {
  headers: { cookie },
});
if (!session.ok) {
  console.error(`CMS session verification failed with HTTP ${session.status}.`);
  process.exit(1);
}

const logout = await fetch(`${baseUrl}/api/cms/auth/logout`, {
  method: "POST",
  headers: { cookie },
});
if (!logout.ok) {
  console.error(`CMS logout verification failed with HTTP ${logout.status}.`);
  process.exit(1);
}

const expiredSession = await fetch(`${baseUrl}/api/cms/auth/session`, {
  headers: { cookie },
});
if (expiredSession.status !== 401) {
  console.error("CMS session remained valid after logout.");
  process.exit(1);
}

console.log("CMS login, database session, and logout verification passed.");
