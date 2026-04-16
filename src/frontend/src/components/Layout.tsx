import { useAuth } from "@/hooks/useAuth";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  CreditCard,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import type { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  ocid: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="w-4 h-4" />,
    ocid: "nav.dashboard_link",
  },
  {
    label: "Generate Video",
    href: "/generate",
    icon: <Video className="w-4 h-4" />,
    ocid: "nav.generate_link",
  },
  {
    label: "Scripts",
    href: "/scripts",
    icon: <BookOpen className="w-4 h-4" />,
    ocid: "nav.scripts_link",
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: <CreditCard className="w-4 h-4" />,
    ocid: "nav.pricing_link",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-4 h-4" />,
    ocid: "nav.settings_link",
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
      aria-label="Toggle theme"
      data-ocid="header.theme_toggle"
    >
      <Sun className="w-4 h-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-smooth" />
      <Moon className="absolute w-4 h-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-smooth" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

function CreditBadge() {
  const { data: balance, isLoading } = useCreditBalance();

  if (isLoading)
    return <div className="w-16 h-6 animate-pulse bg-muted rounded-full" />;

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-sm font-medium"
      data-ocid="header.credit_balance"
    >
      <Zap className="w-3.5 h-3.5 text-primary" />
      <span className="text-foreground">{balance?.available ?? 0}</span>
      <span className="text-muted-foreground">credits</span>
    </div>
  );
}

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const { isAuthenticated, logout, isLoggingIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-card">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Mobile menu toggle */}
          {showSidebar && isAuthenticated && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
              aria-label="Toggle sidebar"
              data-ocid="header.menu_toggle"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            data-ocid="header.logo_link"
          >
            <img
              src="/assets/logo.jpg"
              alt="FacelessAI"
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex-1" />

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated && <CreditBadge />}
            <ThemeToggle />
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                disabled={isLoggingIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                data-ocid="header.logout_button"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        {showSidebar && isAuthenticated && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
                onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
                role="button"
                tabIndex={0}
                aria-label="Close sidebar"
              />
            )}

            <aside
              className={cn(
                "fixed inset-y-0 left-0 z-40 w-60 bg-sidebar border-r border-sidebar-border pt-14 flex flex-col transition-smooth md:static md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth group",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                      data-ocid={item.ocid}
                    >
                      <span
                        className={cn(
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground transition-smooth",
                        )}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary/60" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar footer */}
              <div className="px-3 py-4 border-t border-sidebar-border">
                <Link
                  to="/generate"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-sm font-semibold gradient-accent text-primary-foreground shadow-glow-primary hover:opacity-90 transition-smooth"
                  data-ocid="sidebar.generate_button"
                >
                  <Video className="w-4 h-4" />
                  New Video
                </Link>
              </div>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 bg-background">{children}</main>
      </div>

      {/* Footer — only on non-dashboard pages */}
      {!isAuthenticated && (
        <footer className="bg-card border-t border-border py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              © {new Date().getFullYear()} FacelessAI. All rights reserved.
            </span>
            <span>
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
