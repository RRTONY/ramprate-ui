export type StepStatus = "pending" | "active" | "done" | "error";

export interface WorkflowStep {
  id: "write" | "test" | "checks" | "publish";
  label: string;
  status: StepStatus;
  detail?: string;
}

export interface WorkflowInput {
  filePaths: string[];
  draftCount: number;
  checkStatus: "success" | "pending" | "failure" | "unknown";
  canPublish: boolean;
  published: boolean;
}

// Mirrors the CI job that runs the whole suite: tests live under tests/**,
// so any changed path outside that prefix is a "real" code/content file.
function isTestPath(p: string): boolean {
  return p.startsWith("tests/");
}

// The admin's chat is a linear pipeline (write -> test -> checks -> publish),
// same rule the user asked for: only the first unfinished step is ever
// "active" — everything after it stays locked at "pending" even if its own
// raw signal would otherwise look further along (e.g. canPublish flipping
// true from a stale check before the newest commit's checks have re-run).
function lockSequential(steps: WorkflowStep[]): WorkflowStep[] {
  let locked = false;
  return steps.map((step) => {
    if (locked) return { ...step, status: "pending" };
    if (step.status !== "done") locked = true;
    return step;
  });
}

export function computeWorkflowSteps(input: WorkflowInput): WorkflowStep[] {
  const hasCodeFiles = input.filePaths.some((p) => !isTestPath(p));
  const hasTestFiles = input.filePaths.some(isTestPath);
  const hasAnyChange = hasCodeFiles || input.draftCount > 0;

  const steps: WorkflowStep[] = [
    {
      id: "write",
      label: "Write the change",
      status: hasAnyChange ? "done" : "pending",
    },
  ];

  if (hasCodeFiles) {
    steps.push({
      id: "test",
      label: "Add a test",
      status: hasTestFiles ? "done" : "pending",
      detail: hasTestFiles
        ? undefined
        : "This change edits code but doesn't include a test yet.",
    });
  }

  if (hasAnyChange) {
    steps.push({
      id: "checks",
      label: "Run the checks",
      status:
        input.checkStatus === "success"
          ? "done"
          : input.checkStatus === "failure"
            ? "error"
            : input.checkStatus === "pending"
              ? "active"
              : "pending",
    });
  }

  steps.push({
    id: "publish",
    label: "Publish",
    status: input.published ? "done" : input.canPublish ? "active" : "pending",
  });

  return lockSequential(steps);
}
