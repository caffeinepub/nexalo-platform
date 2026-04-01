import {
  Activity,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Variant_sms_voice_whatsapp_email } from "../backend.d";
import KPICard from "../components/KPICard";
import UsageChart from "../components/UsageChart";
import { useUsageStats } from "../hooks/useQueries";

export default function Analytics() {
  const { data: usageStats, isLoading } = useUsageStats();

  const totals = { sms: 0, voice: 0, email: 0, whatsapp: 0 };
  if (usageStats) {
    for (const r of usageStats) {
      if (r.serviceType === Variant_sms_voice_whatsapp_email.sms)
        totals.sms += Number(r.count);
      else if (r.serviceType === Variant_sms_voice_whatsapp_email.voice)
        totals.voice += Number(r.count);
      else if (r.serviceType === Variant_sms_voice_whatsapp_email.email)
        totals.email += Number(r.count);
      else if (r.serviceType === Variant_sms_voice_whatsapp_email.whatsapp)
        totals.whatsapp += Number(r.count);
    }
  } else {
    totals.sms = 48200;
    totals.voice = 12400;
    totals.email = 87600;
    totals.whatsapp = 9300;
  }

  return (
    <div className="space-y-6" data-ocid="analytics.page">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          ocid="analytics.sms.card"
          title="SMS Sent"
          value={totals.sms.toLocaleString()}
          icon={<MessageSquare size={18} />}
          trend={{ value: 14.2, label: "last 30d" }}
        />
        <KPICard
          ocid="analytics.voice.card"
          title="Voice Minutes"
          value={totals.voice.toLocaleString()}
          icon={<Phone size={18} />}
          trend={{ value: -2.1, label: "last 30d" }}
          color="text-green-400"
        />
        <KPICard
          ocid="analytics.email.card"
          title="Emails Sent"
          value={totals.email.toLocaleString()}
          icon={<Mail size={18} />}
          trend={{ value: 21.5, label: "last 30d" }}
          color="text-yellow-400"
        />
        <KPICard
          ocid="analytics.whatsapp.card"
          title="WhatsApp"
          value={totals.whatsapp.toLocaleString()}
          icon={<MessageCircle size={18} />}
          trend={{ value: 7.8, label: "last 30d" }}
          color="text-purple-400"
        />
      </div>

      <div className="card-surface p-6" data-ocid="analytics.chart.card">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={16} className="text-primary" />
          <h3 className="font-semibold">Usage Over Last 30 Days</h3>
        </div>
        {isLoading ? (
          <div
            className="h-64 flex items-center justify-center text-muted-foreground"
            data-ocid="analytics.chart.loading_state"
          >
            Loading...
          </div>
        ) : (
          <UsageChart data={usageStats} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <h3 className="font-semibold mb-4">Channel Distribution</h3>
          <div className="space-y-3">
            {[
              {
                label: "SMS",
                value: totals.sms,
                color: "bg-blue-500",
                total:
                  totals.sms + totals.voice + totals.email + totals.whatsapp,
              },
              {
                label: "Email",
                value: totals.email,
                color: "bg-yellow-500",
                total:
                  totals.sms + totals.voice + totals.email + totals.whatsapp,
              },
              {
                label: "Voice",
                value: totals.voice,
                color: "bg-green-500",
                total:
                  totals.sms + totals.voice + totals.email + totals.whatsapp,
              },
              {
                label: "WhatsApp",
                value: totals.whatsapp,
                color: "bg-purple-500",
                total:
                  totals.sms + totals.voice + totals.email + totals.whatsapp,
              },
            ].map((item) => {
              const pct =
                item.total > 0
                  ? Math.round((item.value / item.total) * 100)
                  : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card-surface p-6">
          <h3 className="font-semibold mb-4">Top Destinations</h3>
          <div className="space-y-3">
            {[
              { country: "United States", count: "18,420", flag: "🇺🇸" },
              { country: "United Kingdom", count: "9,230", flag: "🇬🇧" },
              { country: "Canada", count: "6,840", flag: "🇨🇦" },
              { country: "Germany", count: "4,910", flag: "🇩🇪" },
              { country: "Australia", count: "3,560", flag: "🇦🇺" },
            ].map((item) => (
              <div
                key={item.country}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  {item.country}
                </span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
