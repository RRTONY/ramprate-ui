"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/flow/utils";
import { Button } from "@/components/flow/ui/button";
import {
  Menu,
  X,
  ClipboardCheck,
  BarChart3,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/flow/useAuth";
import { clearAllPersistedData } from "@/lib/flow/assessmentPersistence";

const navLinks = [
  { href: "/flow/assessment", label: "Assessment" },
  { href: "/flow/team-dashboard", label: "Teams" },
  { href: "/flow/pricing", label: "Pricing" },
  { href: "/flow/science", label: "Science" },
];

export default function FlowNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (pathname === "/flow/assessment") return null;

  const handleLogout = async () => {
    await logout();
    clearAllPersistedData();
    window.location.href = "/flow";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/12 bg-[oklch(0.15_0.04_29/0.9)] text-white backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/flow"
          className="shrink-0 bg-gradient-to-r from-white via-white to-[oklch(0.84_0.15_83)] bg-clip-text text-lg font-bold tracking-tighter text-transparent md:text-xl"
        >
          THE FLOW CIRCUIT
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-white/72 transition-colors hover:text-[oklch(0.9_0.14_83)]",
                pathname === link.href ||
                  (link.href === "/flow/team-dashboard" &&
                    pathname.startsWith("/flow/team"))
                  ? "bg-white/10 text-white"
                  : "",
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && user?.role === "admin" && (
            <>
              <div className="mx-1 h-4 w-px bg-white/20" />
              <Link
                href="/flow/admin"
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/72 transition-colors hover:text-[oklch(0.9_0.14_83)]",
                  pathname === "/flow/admin" ? "bg-white/10 text-white" : "",
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Admin
              </Link>
            </>
          )}

          <div className="mx-2 h-4 w-px bg-white/20" />

          {!loading && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-white/62">
                    <User className="w-3 h-3" />
                    {user?.name || user?.email || "User"}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-white/72 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="mr-1 h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/flow/login">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/72 hover:bg-white/10 hover:text-white"
                  >
                    <LogIn className="mr-1 h-3.5 w-3.5" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}

          <Link href="/flow/assessment">
            <Button
              size="sm"
              className="ml-2 bg-[oklch(0.83_0.15_83)] font-bold text-[oklch(0.18_0.04_29)] shadow-md hover:bg-[oklch(0.89_0.13_83)]"
            >
              <ClipboardCheck className="mr-1.5 h-4 w-4" />
              Take Assessment
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Link href="/flow/assessment">
            <Button
              size="sm"
              className="bg-[oklch(0.83_0.15_83)] px-3 text-xs font-bold text-[oklch(0.18_0.04_29)] shadow-sm hover:bg-[oklch(0.89_0.13_83)]"
            >
              Assess
            </Button>
          </Link>
          <button
            className="p-2 text-white/80 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[oklch(0.15_0.04_29/0.98)] backdrop-blur-md md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-lg px-3 py-3 text-base font-medium text-white/72 transition-colors hover:text-[oklch(0.9_0.14_83)]",
                  pathname === link.href ? "bg-white/10 text-white" : "",
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <div className="my-2 border-t border-white/10" />
                <Link
                  href="/flow/admin"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-white/72 transition-colors hover:text-[oklch(0.9_0.14_83)]",
                    pathname === "/flow/admin" ? "bg-white/10 text-white" : "",
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </>
            )}

            <div className="my-2 border-t border-white/10" />

            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="px-3 py-2">
                    <p className="mb-2 flex items-center gap-1 text-sm text-white/62">
                      <User className="w-3.5 h-3.5" />
                      {user?.name || user?.email || "Signed In"}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/flow/login" className="block px-3 py-2">
                    <Button
                      variant="outline"
                      className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}

            <Link href="/flow/assessment">
              <Button
                className="mt-2 w-full bg-[oklch(0.83_0.15_83)] font-bold text-[oklch(0.18_0.04_29)] hover:bg-[oklch(0.89_0.13_83)]"
                onClick={() => setIsOpen(false)}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Take the Assessment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
