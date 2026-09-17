import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const testimonialsSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/testimonials/TestimonialsClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Testimonials motion", () => {
  it("uses CSS feedback rather than Framer Motion", () => {
    expect(testimonialsSource).not.toContain("framer-motion");
    expect(testimonialsSource).not.toContain("<motion.");
    expect(testimonialsSource).toContain("flow-testimonials-title-enter");
    expect(testimonialsSource).toContain("flow-testimonial-card-enter");
    expect(flowStyles).toContain("@keyframes flow-testimonial-card-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains approved content, reviewed community submissions, and Journey navigation", () => {
    expect(testimonialsSource).toContain(
      "trpc.testimonial.approved.useQuery()",
    );
    expect(testimonialsSource).toContain("trpc.testimonial.submit.useMutation");
    expect(testimonialsSource).toContain(
      "Testimonials are reviewed before being published.",
    );
    expect(testimonialsSource).toContain('router.push("/flow/journey")');
    expect(testimonialsSource).toContain("businessTestimonials");
  });
});
