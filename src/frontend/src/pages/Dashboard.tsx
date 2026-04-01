import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CreditCard,
  Key,
  Mail,
  MessageSquare,
  Phone,
  ShoppingCart,
} from "lucide-react";
import KPICard from "../components/KPICard";
import UsageChart from "../components/UsageChart";
import {
  useDashboardKPIs,
  useUsageStats,
  useUserProfile,
} from "../hooks/useQueries";

const KPI_SKELETON_KEYS = ["kpi-a", "kpi-b", "kpi-c", "kpi-d"];

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs();
  const { data: usageStats } = useUsageStats();
  const { data: profile } = useUserProfile();

  const displayName = profile?.displayName || "Developer";
  const creditBalance =
    profile?.creditBalance ?? kpis?.creditBalance ?? BigInt(0);

  return (
    <div className="space-y-8" data-ocid="dashboard.page">
      <div className="card-surface p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Welcome back, {displayName}! 👋</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s what&apos;s happening with your Nexalo account today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="dashboard.send_sms.button"
          >
            <Link to="/dashboard/docs">Send Test SMS</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            data-ocid="dashboard.buy_number.button"
          >
            <Link to="/dashboard/numbers">Buy Number</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisLoading ? (
          KPI_SKELETON_KEYS.map((k, i) => (
            <Skeleton
              key={k}
              className="h-28 rounded-xl"
              data-ocid={`dashboard.kpi.loading_state.${i + 1}`}
            />
          ))
        ) : (
          <>
            <KPICard
              ocid="dashboard.messages.card"
              title="Total Messages"
              value={Number(kpis?.totalMessages ?? 0).toLocaleString()}
              icon={<MessageSquare size={18} />}
              trend={{ value: 12.4, label: "vs last month" }}
            />
            <KPICard
              ocid="dashboard.api_calls.card"
              title="API Calls"
              value={Number(kpis?.totalApiCalls ?? 0).toLocaleString()}
              icon={<Activity size={18} />}
              trend={{ value: 8.1, label: "vs last month" }}
              color="text-green-400"
            />
            <KPICard
              ocid="dashboard.credits.card"
              title="Credit Balance"
              value={`$${Number(creditBalance).toFixed(2)}`}
              icon={<CreditCard size={18} />}
              color="text-yellow-400"
            />
            <KPICard
              ocid="dashboard.uptime.card"
              title="Uptime"
              value={`${Number(kpis?.uptime ?? 999) / 10}%`}
              icon={<Phone size={18} />}
              trend={{ value: 0.1, label: "this week" }}
              color="text-purple-400"
            />
          </>
        )}
      </div>

      <div className="card-surface p-6" data-ocid="dashboard.usage_chart.card">
        <h3 className="font-semibold mb-6">Message Volume — Last 30 Days</h3>
        <UsageChart data={usageStats} />
      </div>

      <div>
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Mail,
              label: "Send Test SMS",
              desc: "Test your integration quickly",
              to: "/dashboard/docs",
              ocid: "dashboard.quick_sms.button",
            },
            {
              icon: ShoppingCart,
              label: "Buy a Number",
              desc: "Browse available phone numbers",
              to: "/dashboard/numbers",
              ocid: "dashboard.quick_buy.button",
            },
            {
              icon: BookOpen,
              label: "Check the Docs",
              desc: "API references and guides",
              to: "/dashboard/docs",
              ocid: "dashboard.quick_docs.button",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                data-ocid={action.ocid}
                className="card-surface p-5 flex items-center gap-4 hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {profile && (
        <div
          className="card-surface p-6"
          data-ocid="dashboard.account_info.card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Account Credentials</h3>
            <Link
              to="/dashboard/keys"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Manage Keys <Key size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Account SID</p>
              <code className="text-xs font-mono text-green-400 bg-background/80 border border-border rounded px-3 py-2 block truncate">
                {profile.accountSID}
              </code>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Auth Token</p>
              <code className="text-xs font-mono text-yellow-400 bg-background/80 border border-border rounded px-3 py-2 block truncate">
                ••••••••••••••••••••••••••••••••
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
