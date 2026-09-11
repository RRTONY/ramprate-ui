import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import mysql from "mysql2/promise";

const [email] = process.argv.slice(2);
if (!email || !process.env.DATABASE_URL) {
  console.error(
    "Usage: node scripts/set-cms-member-password.mjs <member-email>",
  );
  process.exit(1);
}

const prompts = createInterface({ input, output });
const password = await prompts.question("Temporary CMS password: ");
prompts.close();

if (password.length < 12 || password.length > 256) {
  console.error("The CMS password must contain 12 to 256 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derived = await new Promise((resolve, reject) => {
  scrypt(password, salt, 64, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});
const passwordHash = `scrypt:${salt}:${Buffer.from(derived).toString("hex")}`;

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [result] = await connection.execute(
  "UPDATE cms_admin_members SET password_hash = ?, must_change_password = 1, password_updated_at = NOW() WHERE email = ? AND is_active = 1",
  [passwordHash, email.trim().toLowerCase()],
);
await connection.end();

if (result.affectedRows !== 1) {
  console.error("No active CMS member matched that email address.");
  process.exit(1);
}

console.log("CMS password hash updated for the active member.");
