// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ResultGuidancePanel from "../../src/components/flow/ResultGuidancePanel";

const props = {
  dominantRole: "Conductor",
  profileLabel: "The Integrator",
  actionSteps: [
    {
      title: "Map decisions",
      body: "Clarify ownership before the next review.",
    },
  ],
};

describe("result guidance panel", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("disables the action and shows an accessible pending state while guidance is generated", async () => {
    const user = userEvent.setup();
    let resolveFetch: ((value: Response) => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    render(createElement(ResultGuidancePanel, props));
    await user.click(
      screen.getByRole("button", { name: "Generate next moves" }),
    );

    expect(screen.getByRole("status").textContent).toContain(
      "Preparing a focused answer",
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Generate next moves",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);

    resolveFetch?.(
      new Response(
        JSON.stringify({ answer: "Start with the highest-friction decision." }),
        {
          status: 200,
        },
      ),
    );

    expect(
      await screen.findByText("Start with the highest-friction decision."),
    ).toBeTruthy();
  });

  it("presents a readable error without exposing a failed AI request", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network failure")),
    );

    render(createElement(ResultGuidancePanel, props));
    await user.click(
      screen.getByRole("button", { name: "Generate next moves" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "Your tailored guidance is unavailable right now.",
      );
    });
  });
});
