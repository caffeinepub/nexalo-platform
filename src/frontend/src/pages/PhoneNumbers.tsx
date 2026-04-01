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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, RefreshCw, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_sms_voice } from "../backend.d";
import {
  useAvailableNumbers,
  useMyNumbers,
  usePurchaseNumber,
} from "../hooks/useQueries";

const MY_SKELETON_KEYS = ["my-a", "my-b"];
const CATALOG_SKELETON_KEYS = ["cat-a", "cat-b", "cat-c", "cat-d"];

const MOCK_AVAILABLE = [
  {
    id: "num-1",
    country: "United States",
    number: "+1 (555) 234-5678",
    numberType: Variant_sms_voice.sms,
    monthlyCost: BigInt(100),
  },
  {
    id: "num-2",
    country: "United States",
    number: "+1 (555) 987-6543",
    numberType: Variant_sms_voice.voice,
    monthlyCost: BigInt(200),
  },
  {
    id: "num-3",
    country: "United Kingdom",
    number: "+44 20 7946 0958",
    numberType: Variant_sms_voice.sms,
    monthlyCost: BigInt(150),
  },
  {
    id: "num-4",
    country: "Canada",
    number: "+1 (416) 555-0142",
    numberType: Variant_sms_voice.sms,
    monthlyCost: BigInt(120),
  },
  {
    id: "num-5",
    country: "Germany",
    number: "+49 30 12345678",
    numberType: Variant_sms_voice.voice,
    monthlyCost: BigInt(180),
  },
  {
    id: "num-6",
    country: "Australia",
    number: "+61 2 9876 5432",
    numberType: Variant_sms_voice.sms,
    monthlyCost: BigInt(160),
  },
];

export default function PhoneNumbers() {
  const { data: available, isLoading: availableLoading } =
    useAvailableNumbers();
  const { data: myNumbers, isLoading: myLoading } = useMyNumbers();
  const purchaseNumber = usePurchaseNumber();
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [purchaseTarget, setPurchaseTarget] = useState<string | null>(null);

  const availableList =
    available && available.length > 0 ? available : MOCK_AVAILABLE;
  const countries = [
    "all",
    ...Array.from(new Set(availableList.map((n) => n.country))),
  ];

  const filtered = availableList.filter((n) => {
    const matchSearch =
      n.number.toLowerCase().includes(search.toLowerCase()) ||
      n.country.toLowerCase().includes(search.toLowerCase());
    const matchCountry = countryFilter === "all" || n.country === countryFilter;
    return matchSearch && matchCountry;
  });

  const handlePurchase = async () => {
    if (!purchaseTarget) return;
    try {
      await purchaseNumber.mutateAsync(purchaseTarget);
      toast.success("Number purchased successfully!");
      setPurchaseTarget(null);
    } catch {
      toast.error("Failed to purchase number");
    }
  };

  return (
    <div className="space-y-6" data-ocid="numbers.page">
      <div className="card-surface p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Phone size={16} className="text-primary" /> My Phone Numbers
        </h3>
        {myLoading ? (
          <div className="space-y-3" data-ocid="numbers.my.loading_state">
            {MY_SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-12" />
            ))}
          </div>
        ) : !myNumbers || myNumbers.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground"
            data-ocid="numbers.my.empty_state"
          >
            <Phone size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              No numbers yet. Purchase from the catalog below.
            </p>
          </div>
        ) : (
          <Table data-ocid="numbers.my.table">
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Number</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Purchased</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myNumbers.map((n, i) => (
                <TableRow
                  key={n.id}
                  className="border-border"
                  data-ocid={`numbers.my.item.${i + 1}`}
                >
                  <TableCell className="font-mono text-sm">
                    {n.number}
                  </TableCell>
                  <TableCell>{n.country}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{n.numberType}</Badge>
                  </TableCell>
                  <TableCell>${Number(n.monthlyCost).toFixed(2)}/mo</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(
                      Number(n.purchasedDate) / 1_000_000,
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="card-surface p-6">
        <h3 className="font-semibold mb-4">Number Catalog</h3>
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search numbers..."
              className="pl-8"
              data-ocid="numbers.search.input"
            />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-44" data-ocid="numbers.country.select">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All Countries" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {availableLoading ? (
          <div className="space-y-3" data-ocid="numbers.catalog.loading_state">
            {CATALOG_SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-12" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground"
            data-ocid="numbers.catalog.empty_state"
          >
            No numbers match your search.
          </div>
        ) : (
          <Table data-ocid="numbers.catalog.table">
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Number</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((n, i) => (
                <TableRow
                  key={n.id}
                  className="border-border"
                  data-ocid={`numbers.catalog.item.${i + 1}`}
                >
                  <TableCell className="font-mono text-sm">
                    {n.number}
                  </TableCell>
                  <TableCell>{n.country}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{n.numberType}</Badge>
                  </TableCell>
                  <TableCell>${Number(n.monthlyCost).toFixed(2)}/mo</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground"
                      onClick={() => setPurchaseTarget(n.id)}
                      data-ocid={`numbers.purchase.button.${i + 1}`}
                    >
                      <ShoppingCart size={13} className="mr-1" /> Buy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={!!purchaseTarget}
        onOpenChange={(o) => !o && setPurchaseTarget(null)}
      >
        <DialogContent data-ocid="numbers.purchase.dialog">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to purchase this number? The monthly fee will
            be deducted from your credit balance.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPurchaseTarget(null)}
              data-ocid="numbers.purchase.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={purchaseNumber.isPending}
              className="bg-primary text-primary-foreground"
              data-ocid="numbers.purchase.confirm_button"
            >
              {purchaseNumber.isPending ? (
                <RefreshCw size={14} className="mr-2 animate-spin" />
              ) : (
                <ShoppingCart size={14} className="mr-2" />
              )}
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
