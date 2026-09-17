import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const soulPrintSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/soulprint/SoulPrintClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow SoulPrint motion", () => {
  it("uses scoped reduced-motion-safe CSS instead of Framer Motion for all display wrappers", () => {
    expect(soulPrintSource).not.toContain("framer-motion");
    expect(soulPrintSource).not.toContain("<motion.");
    expect(soulPrintSource).toContain("flow-soulprint-hero-enter");
    expect(soulPrintSource).toContain("flow-soulprint-alpha-enter");
    expect(soulPrintSource).toContain("flow-soulprint-tier-enter");
    expect(soulPrintSource).toContain("flow-soulprint-reveal-enter");
    expect(soulPrintSource).toContain("flow-soulprint-order-enter");
    expect(flowStyles).toContain("@keyframes flow-soulprint-enter");
    expect(flowStyles).toContain("@keyframes flow-soulprint-alpha-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains tier selection, alpha availability, order submission, reflective disclosure, and motion-aware order navigation", () => {
    expect(soulPrintSource).toContain("setSelectedTier(tier.id)");
    expect(soulPrintSource).toContain("alphaCountQuery.data?.count");
    expect(soulPrintSource).toContain("createOrder.mutate({");
    expect(soulPrintSource).toContain('id="order"');
    expect(soulPrintSource).toContain("onClick={scrollToOrder}");
    expect(soulPrintSource).toContain("window.scrollTo({");
    expect(soulPrintSource).toContain("prefers-reduced-motion: reduce");
    expect(soulPrintSource).not.toContain("scrollIntoView");
    expect(soulPrintSource).toContain(
      "reflective entertainment, not a scientific reading",
    );
  });
});
