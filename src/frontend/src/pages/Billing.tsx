import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  CreditCard,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_topup_deduction } from "../backend.d";
import {
  useAddCredits,
  useTransactions,
  useUserProfile,
} from "../hooks/useQueries";

const TX_SKELETON_KEYS = ["tx-sk-a", "tx-sk-b", "tx-sk-c", "tx-sk-d"];

const MOCK_TRANSACTIONS = [
  {
    id: "tx-1",
    transactionType: Variant_topup_deduction.topup,
    description: "Credit top-up",
    timestamp: BigInt(Date.now() - 2 * 86400000) * BigInt(1_000_000),
    amount: BigInt(5000),
  },
  {
    id: "tx-2",
    transactionType: Variant_topup_deduction.deduction,
    description: "SMS: 1,200 messages",
    timestamp: BigInt(Date.now() - 5 * 86400000) * BigInt(1_000_000),
    amount: BigInt(1200),
  },
  {
    id: "tx-3",
    transactionType: Variant_topup_deduction.deduction,
    description: "Voice: 340 minutes",
    timestamp: BigInt(Date.now() - 8 * 86400000) * BigInt(1_000_000),
    amount: BigInt(680),
  },
  {
    id: "tx-4",
    transactionType: Variant_topup_deduction.topup,
    description: "Credit top-up",
    timestamp: BigInt(Date.now() - 15 * 86400000) * BigInt(1_000_000),
    amount: BigInt(10000),
  },
  {
    id: "tx-5",
    transactionType: Variant_topup_deduction.deduction,
    description: "Phone number: +1 555-1234",
    timestamp: BigInt(Date.now() - 20 * 86400000) * BigInt(1_000_000),
    amount: BigInt(100),
  },
];

export default function Billing() {
  const { data: transactions, isLoading } = useTransactions();
  const { data: profile } = useUserProfile();
  const addCredits = useAddCredits();
  const [addOpen, setAddOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const txList =
    transactions && transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;
  const creditBalance = profile?.creditBalance ?? BigInt(0);

  const handleAddCredits = async () => {
    const val = Number.parseFloat(amount);
    if (Number.isNaN(val) || val <= 0) return;
    try {
      await addCredits.mutateAsync(BigInt(Math.round(val * 100)));
      toast.success(`$${val.toFixed(2)} added to your balance`);
      setAmount("");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add credits");
    }
  };

  const parsedAmount = Number.parseFloat(amount);
  const displayAmount =
    !Number.isNaN(parsedAmount) && parsedAmount > 0
      ? parsedAmount.toFixed(2)
      : "0.00";

  return (
    <div className="space-y-6" data-ocid="billing.page">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="card-surface p-6 col-span-1 flex flex-col gap-4"
          data-ocid="billing.balance.card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Credit Balance
              </p>
              <p className="text-4xl font-bold text-primary mt-1">
                ${(Number(creditBalance) / 100).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <CreditCard size={24} className="text-primary" />
            </div>
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground w-full"
            data-ocid="billing.add_credits.open_modal_button"
          >
            <Plus size={16} className="mr-2" /> Add Credits
          </Button>
        </div>
        <div className="card-surface p-6 col-span-1 md:col-span-2">
          <h3 className="font-semibold mb-3">Billing Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "This Month", value: "$24.80" },
              { label: "Last Month", value: "$31.20" },
              { label: "Avg/Month", value: "$28.00" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-semibold mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-surface p-6">
        <h3 className="font-semibold mb-4">Transaction History</h3>
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="billing.transactions.loading_state"
          >
            {TX_SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-12" />
            ))}
          </div>
        ) : (
          <Table data-ocid="billing.transactions.table">
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txList.map((tx, i) => (
                <TableRow
                  key={tx.id}
                  className="border-border"
                  data-ocid={`billing.transactions.item.${i + 1}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.transactionType === Variant_topup_deduction.topup ? (
                        <TrendingUp size={14} className="text-emerald-400" />
                      ) : (
                        <TrendingDown size={14} className="text-red-400" />
                      )}
                      <Badge
                        variant="outline"
                        className={
                          tx.transactionType === Variant_topup_deduction.topup
                            ? "text-emerald-400 border-emerald-400/30"
                            : "text-red-400 border-red-400/30"
                        }
                      >
                        {tx.transactionType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{tx.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(
                      Number(tx.timestamp) / 1_000_000,
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${tx.transactionType === Variant_topup_deduction.topup ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {tx.transactionType === Variant_topup_deduction.topup
                      ? "+"
                      : "-"}
                    ${(Number(tx.amount) / 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="billing.add_credits.dialog">
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Choose an amount to add to your balance.
            </p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {["10", "25", "50", "100"].map((v) => (
                <Button
                  key={v}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(v)}
                  className={amount === v ? "border-primary text-primary" : ""}
                  data-ocid={`billing.preset_${v}.button`}
                >
                  ${v}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount ($)"
              min="1"
              data-ocid="billing.credits_amount.input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="billing.add_credits.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCredits}
              disabled={addCredits.isPending || !amount}
              className="bg-primary text-primary-foreground"
              data-ocid="billing.add_credits.confirm_button"
            >
              {addCredits.isPending ? (
                <RefreshCw size={14} className="mr-2 animate-spin" />
              ) : null}
              Add ${displayAmount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
