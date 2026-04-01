import { motion } from "motion/react";
import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: string;
  ocid?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "text-primary",
  ocid,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-surface p-5 flex flex-col gap-3"
      data-ocid={ocid}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg bg-primary/10 ${color}`}>{icon}</div>
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs ${
            trend.value >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          <span>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
