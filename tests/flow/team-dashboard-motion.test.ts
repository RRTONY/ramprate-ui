import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const dashboardSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/flow/team-dashboard/TeamDashboardClient.tsx",
  ),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Team Dashboard motion", () => {
  it("uses reduced-motion-safe CSS rather than Framer Motion for role distribution", () => {
    expect(dashboardSource).not.toContain("framer-motion");
    expect(dashboardSource).not.toContain("<motion.div");
    expect(dashboardSource).toContain("flow-team-dashboard-role-bar");
    expect(flowStyles).toContain(
      "@keyframes flow-team-dashboard-role-bar-enter",
    );
    expect(flowStyles).toContain("transform-origin: left center");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains team data, computed percentages, and dashboard controls", () => {
    expect(dashboardSource).toContain("trpc.team.myTeams.useQuery");
    expect(dashboardSource).toContain("trpc.team.members.useQuery");
    expect(dashboardSource).toContain("getRolePercentage(role)");
    expect(dashboardSource).toContain("Invite Team");
    expect(dashboardSource).toContain("Settings");
  });
});
