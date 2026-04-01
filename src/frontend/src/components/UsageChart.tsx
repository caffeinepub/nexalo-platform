import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UsageRecord } from "../backend.d";

interface ChartPoint {
  date: string;
  sms: number;
  voice: number;
  email: number;
  whatsapp: number;
}

function generateMockData(): ChartPoint[] {
  const data: ChartPoint[] = [];
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    data.push({
      date: label,
      sms: Math.floor(Math.random() * 800 + 200),
      voice: Math.floor(Math.random() * 300 + 50),
      email: Math.floor(Math.random() * 500 + 100),
      whatsapp: Math.floor(Math.random() * 200 + 30),
    });
  }
  return data;
}

interface UsageChartProps {
  data?: UsageRecord[];
}

export default function UsageChart({ data }: UsageChartProps) {
  const chartData =
    data && data.length > 0 ? buildChartFromRecords(data) : generateMockData();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.028 240)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "oklch(0.68 0.020 220)" }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "oklch(0.68 0.020 220)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.19 0.030 240)",
            border: "1px solid oklch(0.24 0.028 240)",
            borderRadius: "8px",
            color: "oklch(0.97 0.005 240)",
            fontSize: "12px",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: "oklch(0.68 0.020 220)" }}
        />
        <Line
          type="monotone"
          dataKey="sms"
          stroke="oklch(0.57 0.18 255)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="voice"
          stroke="oklch(0.70 0.17 162)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="email"
          stroke="oklch(0.75 0.19 85)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="whatsapp"
          stroke="oklch(0.65 0.24 295)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function buildChartFromRecords(records: UsageRecord[]): ChartPoint[] {
  const map: Record<string, ChartPoint> = {};
  for (const r of records) {
    const date = new Date(Number(r.date)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!map[date])
      map[date] = { date, sms: 0, voice: 0, email: 0, whatsapp: 0 };
    const entry = map[date];
    if (entry)
      entry[r.serviceType as keyof Omit<ChartPoint, "date">] =
        (entry[r.serviceType as keyof Omit<ChartPoint, "date">] || 0) +
        Number(r.count);
  }
  return Object.values(map);
}
