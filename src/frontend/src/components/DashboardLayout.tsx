import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Key,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Phone,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    path: "/dashboard/keys",
    label: "API Keys",
    icon: Key,
    ocid: "nav.keys.link",
  },
  {
    path: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart2,
    ocid: "nav.analytics.link",
  },
  {
    path: "/dashboard/numbers",
    label: "Phone Numbers",
    icon: Phone,
    ocid: "nav.numbers.link",
  },
  {
    path: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    ocid: "nav.billing.link",
  },
  {
    path: "/dashboard/docs",
    label: "API Docs",
    icon: FileText,
    ocid: "nav.docs.link",
  },
  { path: "/dashboard/logs", label: "Logs", icon: List, ocid: "nav.logs.link" },
  {
    path: "/dashboard/support",
    label: "Support",
    icon: HelpCircle,
    ocid: "nav.support.link",
  },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const handleLogout = () => {
    clear();
    navigate({ to: "/" });
  };

  const displayName = profile?.displayName || "Developer";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <img
          src="/assets/generated/nexalo-icon-transparent.dim_80x80.png"
          alt="Nexalo"
          className="w-8 h-8 flex-shrink-0"
        />
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight">
            Nexalo
          </span>
        )}
      </div>
      <nav
        className="flex-1 py-4 space-y-1 px-2"
        data-ocid="dashboard.nav.panel"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              data-ocid={item.ocid}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {identity.getPrincipal().toString().slice(0, 20)}...
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          data-ocid="nav.logout.button"
          className={`mt-3 text-muted-foreground hover:text-destructive w-full ${
            collapsed ? "justify-center px-0" : "justify-start"
          }`}
        >
          <LogOut size={16} />
          {!collapsed && <span className="ml-2">Log Out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar border-r border-border transition-all duration-300 flex-shrink-0 relative ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <SidebarContent />
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          data-ocid="nav.sidebar.toggle"
          className="absolute top-1/2 -translate-y-1/2 w-5 h-10 bg-border hover:bg-primary/30 flex items-center justify-center rounded-r-md transition-colors"
          style={{ left: collapsed ? "64px" : "224px" }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-56 bg-sidebar border-r border-border">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile_menu.button"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-foreground">
              {navItems.find((n) => n.path === location.pathname)?.label ||
                "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={16} />
            <span className="text-sm">{displayName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
