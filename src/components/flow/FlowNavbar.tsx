"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/flow/utils";
import { Button } from "@/components/flow/ui/button";
import { Menu, X, ClipboardCheck, BarChart3, LogIn, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname === "/flow/assessment") return null;

  const handleLogout = async () => {
    await logout();
    clearAllPersistedData();
    window.location.href = "/flow";
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/flow"
          className="text-lg md:text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary shrink-0"
        >
          THE FLOW CIRCUIT
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                pathname === link.href || (link.href === "/flow/team-dashboard" && pathname.startsWith("/flow/team"))
                  ? "text-foreground bg-muted/50"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && user?.role === "admin" && (
            <>
              <div className="w-px h-4 bg-border mx-1" />
              <Link
                href="/flow/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md flex items-center gap-1",
                  pathname === "/flow/admin" ? "text-foreground bg-muted/50" : "text-muted-foreground"
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Admin
              </Link>
            </>
          )}

          <div className="w-px h-4 bg-border mx-2" />

          {!loading && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {user?.name || user?.email || "User"}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="mr-1 h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/flow/login">
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <LogIn className="mr-1 h-3.5 w-3.5" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}

          <Link href="/flow/assessment">
            <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold shadow-md ml-2">
              <ClipboardCheck className="mr-1.5 h-4 w-4" />
              Take Assessment
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Link href="/flow/assessment">
            <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold shadow-sm text-xs px-3">
              Assess
            </Button>
          </Link>
          <button
            className="p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-base font-medium transition-colors hover:text-primary px-3 py-3 rounded-lg",
                  pathname === link.href ? "text-foreground bg-muted/50" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <div className="border-t border-border/30 my-2" />
                <Link
                  href="/flow/admin"
                  className={cn(
                    "flex items-center gap-2 text-base font-medium transition-colors hover:text-primary px-3 py-3 rounded-lg",
                    pathname === "/flow/admin" ? "text-foreground bg-muted/50" : "text-muted-foreground"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </>
            )}

            <div className="border-t border-border/30 my-2" />

            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="px-3 py-2">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {user?.name || user?.email || "Signed In"}
                    </p>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/flow/login" className="block px-3 py-2">
                    <Button variant="outline" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}

            <Link href="/flow/assessment">
              <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold mt-2">
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
