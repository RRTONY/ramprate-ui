import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const metricsSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/flow/investor-metrics/InvestorMetricsClient.tsx",
  ),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Investor Metrics motion", () => {
  it("uses reduced-motion-safe CSS instead of Framer Motion for visual entry", () => {
    expect(metricsSource).not.toContain("framer-motion");
    expect(metricsSource).not.toContain("<motion.");
    expect(metricsSource).toContain("flow-investor-metrics-hero-enter");
    expect(metricsSource).toContain("flow-investor-metrics-kpi-enter");
    expect(flowStyles).toContain("@keyframes flow-investor-metrics-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains protected metrics data, dynamic KPI staggering, and chart logic", () => {
    expect(metricsSource).toContain('user?.role === "admin"');
    expect(metricsSource).toContain("trpc.admin.stats.useQuery");
    expect(metricsSource).toContain("trpc.norming.data.useQuery");
    expect(metricsSource).toContain("animationDelay: `${i * 100}ms`");
    expect(metricsSource).toContain("roleDistribution");
    expect(metricsSource).toContain("const pct =");
  });
});
