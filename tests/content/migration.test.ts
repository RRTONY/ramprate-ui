import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import mysql, { type RowDataPacket } from "mysql2/promise";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

interface ContentCount extends RowDataPacket {
  content_type: string;
  record_count: number;
}

let connection: mysql.Connection;

beforeAll(async () => {
  expect(process.env.DATABASE_URL).toBeTruthy();
  connection = await mysql.createConnection(process.env.DATABASE_URL!);
});

afterAll(async () => {
  await connection?.end();
});

describe("managed content migration", () => {
  it("retains all exported public content and image metadata in the managed database", async () => {
    const [rows] = await connection.query<ContentCount[]>(
      "SELECT content_type, COUNT(*) AS record_count FROM content_documents GROUP BY content_type",
    );
    const counts = new Map(
      rows.map((row) => [row.content_type, Number(row.record_count)]),
    );

    expect(counts.get("siteSettings")).toBe(1);
    expect(counts.get("page")).toBe(14);
    expect(counts.get("post")).toBe(97);
    expect(counts.get("sanity.imageAsset")).toBe(646);
  });

  it("removes retired Sanity runtime packages from the project manifest", async () => {
    const manifest = JSON.parse(
      await readFile(resolve(process.cwd(), "package.json"), "utf8"),
    ) as { dependencies: Record<string, string> };

    for (const packageName of [
      "@sanity/client",
      "@sanity/image-url",
      "@sanity/vision",
      "next-sanity",
      "sanity",
    ]) {
      expect(manifest.dependencies[packageName]).toBeUndefined();
    }
  });
});
