import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { useLogs } from "../hooks/useQueries";

const LOG_SKELETON_KEYS = [
  "log-sk-a",
  "log-sk-b",
  "log-sk-c",
  "log-sk-d",
  "log-sk-e",
  "log-sk-f",
];

const MOCK_LOGS = [
  {
    id: "log-1",
    method: "POST",
    endpoint: "/v1/sms/send",
    statusCode: BigInt(200),
    durationMs: BigInt(142),
    timestamp: BigInt(Date.now() - 120000) * BigInt(1_000_000),
  },
  {
    id: "log-2",
    method: "GET",
    endpoint: "/v1/numbers",
    statusCode: BigInt(200),
    durationMs: BigInt(38),
    timestamp: BigInt(Date.now() - 300000) * BigInt(1_000_000),
  },
  {
    id: "log-3",
    method: "POST",
    endpoint: "/v1/voice/call",
    statusCode: BigInt(201),
    durationMs: BigInt(234),
    timestamp: BigInt(Date.now() - 600000) * BigInt(1_000_000),
  },
  {
    id: "log-4",
    method: "POST",
    endpoint: "/v1/sms/send",
    statusCode: BigInt(422),
    durationMs: BigInt(54),
    timestamp: BigInt(Date.now() - 900000) * BigInt(1_000_000),
  },
  {
    id: "log-5",
    method: "GET",
    endpoint: "/v1/usage",
    statusCode: BigInt(200),
    durationMs: BigInt(67),
    timestamp: BigInt(Date.now() - 1800000) * BigInt(1_000_000),
  },
  {
    id: "log-6",
    method: "POST",
    endpoint: "/v1/verify/send",
    statusCode: BigInt(200),
    durationMs: BigInt(189),
    timestamp: BigInt(Date.now() - 3600000) * BigInt(1_000_000),
  },
  {
    id: "log-7",
    method: "DELETE",
    endpoint: "/v1/keys/abc123",
    statusCode: BigInt(204),
    durationMs: BigInt(29),
    timestamp: BigInt(Date.now() - 7200000) * BigInt(1_000_000),
  },
  {
    id: "log-8",
    method: "POST",
    endpoint: "/v1/email/send",
    statusCode: BigInt(500),
    durationMs: BigInt(3210),
    timestamp: BigInt(Date.now() - 14400000) * BigInt(1_000_000),
  },
];

function statusColor(code: bigint) {
  const n = Number(code);
  if (n < 300) return "text-emerald-400 border-emerald-400/30";
  if (n < 400) return "text-yellow-400 border-yellow-400/30";
  return "text-red-400 border-red-400/30";
}

export default function Logs() {
  const { data: logs, isLoading } = useLogs();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const logList = logs && logs.length > 0 ? logs : MOCK_LOGS;
  const filtered = logList.filter(
    (l) =>
      l.endpoint.toLowerCase().includes(search.toLowerCase()) ||
      l.method.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4" data-ocid="logs.page">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by endpoint or method..."
            className="pl-8"
            data-ocid="logs.search.input"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => qc.invalidateQueries({ queryKey: ["logs"] })}
          data-ocid="logs.refresh.button"
        >
          <RefreshCw size={14} className="mr-2" /> Refresh
        </Button>
      </div>

      <div className="card-surface" data-ocid="logs.table">
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="logs.table.loading_state">
            {LOG_SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-12" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="logs.table.empty_state"
          >
            No logs found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log, i) => (
                <TableRow
                  key={log.id}
                  className="border-border font-mono text-xs"
                  data-ocid={`logs.table.item.${i + 1}`}
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        log.method === "GET"
                          ? "text-blue-400 border-blue-400/30"
                          : log.method === "POST"
                            ? "text-green-400 border-green-400/30"
                            : log.method === "DELETE"
                              ? "text-red-400 border-red-400/30"
                              : ""
                      }`}
                    >
                      {log.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.endpoint}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColor(log.statusCode)}
                    >
                      {Number(log.statusCode)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {Number(log.durationMs)}ms
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(
                      Number(log.timestamp) / 1_000_000,
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
