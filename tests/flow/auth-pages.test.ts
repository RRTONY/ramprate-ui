// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  invalidate: vi.fn(),
  register: vi.fn(),
  routerPush: vi.fn(),
  signIn: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));
const nativeSetTimeout = window.setTimeout.bind(window);

const timerMock = ((
  callback: TimerHandler,
  delay?: number,
  ...args: unknown[]
) => {
  if (delay === 600) return 0;
  return nativeSetTimeout(callback, delay, ...args);
}) as unknown as typeof setTimeout;

vi.mock("next-auth/react", () => ({ signIn: mocks.signIn }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.routerPush }),
  useSearchParams: () => new URLSearchParams("redirect=/flow/team-dashboard"),
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: unknown }) => children,
}));

vi.mock("sonner", () => ({
  toast: { error: mocks.toastError, success: mocks.toastSuccess },
}));

vi.mock("@/lib/flow/trpc", () => ({
  trpc: {
    useUtils: () => ({ auth: { me: { invalidate: mocks.invalidate } } }),
    auth: {
      register: {
        useMutation: () => ({ mutateAsync: mocks.register, isPending: false }),
      },
    },
  },
}));

import LoginPage from "../../src/app/flow/login/page";
import SignupPage from "../../src/app/flow/signup/page";

describe("Flow credential entry pages", () => {
  beforeEach(() => {
    mocks.invalidate.mockResolvedValue(undefined);
    mocks.register.mockResolvedValue(undefined);
    mocks.signIn.mockResolvedValue({ ok: true });
    vi.spyOn(window, "setTimeout").mockImplementation(timerMock);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("shows inline validation for missing sign-in credentials", async () => {
    const user = userEvent.setup();
    render(createElement(LoginPage));

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Email is required.")).toBeTruthy();
    expect(screen.getByText("Password is required.")).toBeTruthy();
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("disables the sign-in action and displays its spinner while authentication is pending", async () => {
    const user = userEvent.setup();
    let resolveSignIn: ((value: { ok: true }) => void) | undefined;
    mocks.signIn.mockImplementation(
      () =>
        new Promise<{ ok: true }>((resolve) => {
          resolveSignIn = resolve;
        }),
    );

    render(createElement(LoginPage));
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "secure-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const submitButton = screen.getByRole("button", { name: "Sign in" });
    expect(submitButton.getAttribute("aria-busy")).toBe("true");
    expect(submitButton.hasAttribute("disabled")).toBe(true);
    expect(submitButton.querySelector("svg")).not.toBeNull();

    resolveSignIn?.({ ok: true });
    await waitFor(() =>
      expect(mocks.toastSuccess).toHaveBeenCalledWith("Logged in successfully"),
    );
    expect(mocks.invalidate).toHaveBeenCalledOnce();
    expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 600);
  });

  it("shows a clear credential failure message without redirecting", async () => {
    const user = userEvent.setup();
    mocks.signIn.mockResolvedValue({ error: "CredentialsSignin" });
    render(createElement(LoginPage));

    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "incorrect-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Invalid email or password.")).toBeTruthy();
    expect(mocks.toastError).toHaveBeenCalledWith("Invalid email or password.");
    expect(mocks.invalidate).not.toHaveBeenCalled();
  });

  it("validates account creation before calling the external registration service", async () => {
    const user = userEvent.setup();
    render(createElement(SignupPage));

    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Name is required.")).toBeTruthy();
    expect(screen.getByText("Email is required.")).toBeTruthy();
    expect(screen.getByText("Password is required.")).toBeTruthy();
    expect(mocks.register).not.toHaveBeenCalled();
  });

  it("presents upstream account-creation errors in the sign-up form", async () => {
    const user = userEvent.setup();
    mocks.register.mockRejectedValue(
      new Error("An account already exists for this email."),
    );
    render(createElement(SignupPage));

    await user.type(screen.getByLabelText("Name"), "Avery Client");
    await user.type(screen.getByLabelText("Email"), "avery@example.com");
    await user.type(screen.getByLabelText("Password"), "secure-password");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(
      await screen.findByText("An account already exists for this email."),
    ).toBeTruthy();
    expect(mocks.signIn).not.toHaveBeenCalled();
  });
});
