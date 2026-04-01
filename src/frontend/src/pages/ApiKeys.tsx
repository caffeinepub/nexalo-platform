import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_active_revoked } from "../backend.d";
import {
  useApiKeys,
  useGenerateApiKey,
  useRevokeApiKey,
  useUserProfile,
} from "../hooks/useQueries";

const KEY_SKELETON_KEYS = ["key-sk-a", "key-sk-b", "key-sk-c"];

export default function ApiKeys() {
  const { data: keys, isLoading } = useApiKeys();
  const { data: profile } = useUserProfile();
  const generateKey = useGenerateApiKey();
  const revokeKey = useRevokeApiKey();
  const [newKeyName, setNewKeyName] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleGenerate = async () => {
    if (!newKeyName.trim()) return;
    try {
      await generateKey.mutateAsync(newKeyName.trim());
      toast.success(`API key "${newKeyName}" created`);
      setNewKeyName("");
      setGenerateOpen(false);
    } catch {
      toast.error("Failed to generate key");
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      await revokeKey.mutateAsync(revokeTarget);
      toast.success("API key revoked");
      setRevokeTarget(null);
    } catch {
      toast.error("Failed to revoke key");
    }
  };

  return (
    <div className="space-y-6" data-ocid="apikeys.page">
      {profile && (
        <div className="card-surface p-6">
          <h3 className="font-semibold mb-4">Account Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Account SID</p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono text-green-400 bg-background/80 border border-border rounded px-3 py-2 truncate">
                  {profile.accountSID}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(profile.accountSID, "Account SID")
                  }
                  data-ocid="apikeys.account_sid.button"
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Auth Token</p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono text-yellow-400 bg-background/80 border border-border rounded px-3 py-2 truncate">
                  {showToken ? profile.authToken : "•".repeat(32)}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowToken(!showToken)}
                  data-ocid="apikeys.auth_token_toggle.button"
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(profile.authToken, "Auth Token")
                  }
                  data-ocid="apikeys.auth_token_copy.button"
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">API Keys</h3>
          <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                data-ocid="apikeys.generate.open_modal_button"
              >
                <Plus size={15} className="mr-1" /> Generate Key
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="apikeys.generate.dialog">
              <DialogHeader>
                <DialogTitle>Generate New API Key</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <label
                  htmlFor="key-name"
                  className="text-sm text-muted-foreground block mb-2"
                >
                  Key Name
                </label>
                <Input
                  id="key-name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Server"
                  data-ocid="apikeys.keyname.input"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setGenerateOpen(false)}
                  data-ocid="apikeys.generate.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={generateKey.isPending || !newKeyName.trim()}
                  data-ocid="apikeys.generate.confirm_button"
                  className="bg-primary text-primary-foreground"
                >
                  {generateKey.isPending ? (
                    <RefreshCw size={14} className="mr-2 animate-spin" />
                  ) : null}
                  Generate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3" data-ocid="apikeys.table.loading_state">
            {KEY_SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-12" />
            ))}
          </div>
        ) : !keys || keys.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="apikeys.table.empty_state"
          >
            <KeyRound size={40} className="mx-auto mb-3 opacity-30" />
            <p>No API keys yet. Generate your first key to get started.</p>
          </div>
        ) : (
          <Table data-ocid="apikeys.table">
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key, idx) => (
                <TableRow
                  key={key.keyValue}
                  className="border-border"
                  data-ocid={`apikeys.table.row.${idx + 1}`}
                >
                  <TableCell className="font-medium">{key.keyName}</TableCell>
                  <TableCell>
                    <code className="text-xs font-mono text-muted-foreground">
                      {key.keyValue.slice(0, 20)}...
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        key.status === Variant_active_revoked.active
                          ? "default"
                          : "secondary"
                      }
                      className={
                        key.status === Variant_active_revoked.active
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : ""
                      }
                    >
                      {key.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(
                      Number(key.createdDate) / 1_000_000,
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(key.keyValue, "API Key")}
                        data-ocid={`apikeys.copy.button.${idx + 1}`}
                      >
                        <Copy size={14} />
                      </Button>
                      {key.status === Variant_active_revoked.active && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setRevokeTarget(key.keyValue)}
                          data-ocid={`apikeys.revoke.button.${idx + 1}`}
                          className="hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={!!revokeTarget}
        onOpenChange={(o) => !o && setRevokeTarget(null)}
      >
        <DialogContent data-ocid="apikeys.revoke.dialog">
          <DialogHeader>
            <DialogTitle>Revoke API Key?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. All requests using this key will be
            rejected.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeTarget(null)}
              data-ocid="apikeys.revoke.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={revokeKey.isPending}
              data-ocid="apikeys.revoke.confirm_button"
            >
              {revokeKey.isPending ? (
                <RefreshCw size={14} className="mr-2 animate-spin" />
              ) : null}
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
