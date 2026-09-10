"use client";

import { useAuth } from "@/hooks/flow/useAuth";
import { trpc } from "@/lib/flow/trpc";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/flow/ui/card";
import { Button } from "@/components/flow/ui/button";
import {
  Loader2,
  ArrowLeft,
  GitCompare,
  AlertTriangle,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const COMPARISON_ROLES = [
  "Spark",
  "Amplifier",
  "Filter",
  "Ground",
  "Conductor",
] as const;

type ComparisonRole = (typeof COMPARISON_ROLES)[number];

interface TeamOption {
  id: number;
  name: string;
  companyName?: string | null;
}

interface RoleBreakdown {
  role: ComparisonRole;
  count: number;
  percentage: number;
}

interface ComparisonTeam {
  name: string;
  memberCount: number;
  averageScore: number;
  roleBreakdown: RoleBreakdown[];
  missingRoles: ComparisonRole[];
}

interface TeamComparisonResult {
  team1: ComparisonTeam;
  team2: ComparisonTeam;
}

const ROLE_COLORS: Record<ComparisonRole, string> = {
  Spark: "#f59e0b",
  Amplifier: "#3b82f6",
  Filter: "#8b5cf6",
  Ground: "#10b981",
  Conductor: "#ef4444",
};

const ROLE_ICONS: Record<ComparisonRole, string> = {
  Spark: "⚡",
  Amplifier: "📡",
  Filter: "🔬",
  Ground: "🪨",
  Conductor: "🎯",
};

export default function TeamComparison() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data: myTeams, isLoading: teamsLoading } = trpc.team.myTeams.useQuery(
    undefined,
    {
      enabled: !!user,
    },
  );

  const [team1Id, setTeam1Id] = useState<number | null>(null);
  const [team2Id, setTeam2Id] = useState<number | null>(null);

  const { data: comparison, isLoading: comparisonLoading } =
    trpc.teamComparison.compare.useQuery(
      { teamId1: team1Id!, teamId2: team2Id! },
      { enabled: !!team1Id && !!team2Id },
    );

  if (authLoading || teamsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <GitCompare className="w-16 h-16 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold">Login Required</h1>
          <p className="text-muted-foreground">Sign in to compare teams.</p>
          <Button onClick={() => router.push("/flow")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const teams = (myTeams ?? []) as TeamOption[];
  const comparisonResult = comparison as TeamComparisonResult | undefined;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <GitCompare className="w-8 h-8" />
              Team Comparison
            </h1>
            <p className="text-muted-foreground mt-1">
              Side-by-side Flow Circuit analysis - see where teams align and
              where they clash
            </p>
          </div>
          <Button
            onClick={() => router.push("/flow")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>

        {/* Team Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-gray-500">
                Team A
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No teams found. Create a team first.
                </p>
              ) : (
                <div className="space-y-2">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setTeam1Id(team.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        team1Id === team.id
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <p className="font-bold">{team.name}</p>
                      {team.companyName && (
                        <p className="text-xs opacity-70">{team.companyName}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-gray-500">
                Team B
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No teams found. Create a team first.
                </p>
              ) : (
                <div className="space-y-2">
                  {teams
                    .filter((team) => team.id !== team1Id)
                    .map((team) => (
                      <button
                        key={team.id}
                        onClick={() => setTeam2Id(team.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          team2Id === team.id
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <p className="font-bold">{team.name}</p>
                        {team.companyName && (
                          <p className="text-xs opacity-70">
                            {team.companyName}
                          </p>
                        )}
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comparison Results */}
        {comparisonLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {comparisonResult && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {[comparisonResult.team1, comparisonResult.team2].map(
                (team, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{team.name}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {team.memberCount} members
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">
                          Average alignment:{" "}
                          <span className="font-bold">
                            {team.averageScore}%
                          </span>
                        </span>
                      </div>

                      {/* Role Breakdown Bars */}
                      <div className="space-y-2">
                        {team.roleBreakdown.map((roleBreakdown) => (
                          <div key={roleBreakdown.role} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-bold">
                                {ROLE_ICONS[roleBreakdown.role]}{" "}
                                {roleBreakdown.role}
                              </span>
                              <span className="text-muted-foreground">
                                {roleBreakdown.count} (
                                {roleBreakdown.percentage}%)
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${roleBreakdown.percentage}%`,
                                  backgroundColor:
                                    ROLE_COLORS[roleBreakdown.role] ||
                                    "#6b7280",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Missing Roles Warning */}
                      {team.missingRoles.length > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <div className="text-xs">
                            <p className="font-bold text-amber-800">
                              Missing Roles
                            </p>
                            <p className="text-amber-700">
                              No {team.missingRoles.join(", ")} energy detected.
                              This team may struggle with{" "}
                              {team.missingRoles.includes("Spark") &&
                                "generating new ideas, "}
                              {team.missingRoles.includes("Amplifier") &&
                                "building momentum, "}
                              {team.missingRoles.includes("Filter") &&
                                "quality control, "}
                              {team.missingRoles.includes("Ground") &&
                                "execution and follow-through, "}
                              {team.missingRoles.includes("Conductor") &&
                                "coordination and alignment, "}
                              creating stress for those forced to cover the gap.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ),
              )}
            </div>

            {/* Head-to-Head Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Head-to-Head Energy Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {COMPARISON_ROLES.map((role) => {
                    const t1 = comparisonResult.team1.roleBreakdown.find(
                      (roleBreakdown) => roleBreakdown.role === role,
                    );
                    const t2 = comparisonResult.team2.roleBreakdown.find(
                      (roleBreakdown) => roleBreakdown.role === role,
                    );
                    const t1Pct = t1?.percentage || 0;
                    const t2Pct = t2?.percentage || 0;
                    return (
                      <div key={role} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold w-24">
                            {ROLE_ICONS[role]} {role}
                          </span>
                          <div className="flex-1 flex items-center gap-2">
                            {/* Team A bar (right-aligned) */}
                            <div className="flex-1 flex justify-end">
                              <div
                                className="h-6 rounded-l-md flex items-center justify-end px-2 text-xs font-bold text-white transition-all duration-700"
                                style={{
                                  width: `${Math.max(t1Pct, 5)}%`,
                                  backgroundColor: ROLE_COLORS[role],
                                  opacity: 0.8,
                                }}
                              >
                                {t1Pct}%
                              </div>
                            </div>
                            <div className="w-px h-6 bg-gray-300" />
                            {/* Team B bar (left-aligned) */}
                            <div className="flex-1">
                              <div
                                className="h-6 rounded-r-md flex items-center px-2 text-xs font-bold text-white transition-all duration-700"
                                style={{
                                  width: `${Math.max(t2Pct, 5)}%`,
                                  backgroundColor: ROLE_COLORS[role],
                                  opacity: 0.6,
                                }}
                              >
                                {t2Pct}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 px-24">
                    <span className="font-bold">{comparison.team1.name}</span>
                    <span className="font-bold">{comparison.team2.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* M&A Integration Insight */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>Integration Insight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  When merging these two teams, the combined energy profile
                  reveals where natural synergies exist and where friction will
                  emerge. The roles that are{" "}
                  <strong>strong in one team but weak in the other</strong>{" "}
                  represent the highest-value integration points - these are the
                  people who will fill gaps the other team didn&#39;t know it
                  had.
                </p>

                {(() => {
                  const t1Missing = new Set(comparison.team1.missingRoles);
                  const t2Missing = new Set(comparison.team2.missingRoles);
                  const t1Fills = comparison.team2.missingRoles.filter(
                    (r: string) => !t1Missing.has(r),
                  );
                  const t2Fills = comparison.team1.missingRoles.filter(
                    (r: string) => !t2Missing.has(r),
                  );
                  const bothMissing = comparison.team1.missingRoles.filter(
                    (r: string) => t2Missing.has(r),
                  );

                  return (
                    <div className="space-y-3">
                      {t1Fills.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm">
                            <span className="font-bold text-green-800">
                              ✓ {comparison.team1.name}
                            </span>{" "}
                            <span className="text-green-700">
                              fills {comparison.team2.name}&#39;s gap in:{" "}
                              {t1Fills.join(", ")}
                            </span>
                          </p>
                        </div>
                      )}
                      {t2Fills.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm">
                            <span className="font-bold text-green-800">
                              ✓ {comparison.team2.name}
                            </span>{" "}
                            <span className="text-green-700">
                              fills {comparison.team1.name}&#39;s gap in:{" "}
                              {t2Fills.join(", ")}
                            </span>
                          </p>
                        </div>
                      )}
                      {bothMissing.length > 0 && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm">
                            <span className="font-bold text-red-800">
                              ⚠ Both teams lack:
                            </span>{" "}
                            <span className="text-red-700">
                              {bothMissing.join(", ")} - this is a critical hire
                              priority post-merger
                            </span>
                          </p>
                        </div>
                      )}
                      {t1Fills.length === 0 &&
                        t2Fills.length === 0 &&
                        bothMissing.length === 0 && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">
                              Both teams have full role coverage. Focus
                              integration on aligning the{" "}
                              <strong>dominant energies</strong> to prevent role
                              collision.
                            </p>
                          </div>
                        )}
                    </div>
                  );
                })()}

                <p className="text-xs text-muted-foreground italic">
                  &quot;Don&#39;t just merge balance sheets; merge nervous
                  systems. Map the acquirer and the acquired to prevent organ
                  rejection.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!comparison && !comparisonLoading && team1Id && team2Id && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No comparison data available for these teams.</p>
          </div>
        )}

        {(!team1Id || !team2Id) && (
          <div className="text-center py-16">
            <GitCompare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Select two teams above to see their side-by-side Flow Circuit
              comparison.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Ideal for M&A integration, department mergers, or cross-team
              collaboration planning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
