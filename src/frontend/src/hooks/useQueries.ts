import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApiKey,
  ApiLog,
  AvailableNumber,
  DashboardKPIs,
  OwnedNumber,
  Transaction,
  UsageRecord,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useDashboardKPIs() {
  const { actor, isFetching } = useActor();
  return useQuery<DashboardKPIs>({
    queryKey: ["dashboardKPIs"],
    queryFn: async () => {
      if (!actor)
        return {
          totalMessages: BigInt(0),
          uptime: BigInt(0),
          creditBalance: BigInt(0),
          totalApiCalls: BigInt(0),
        };
      return actor.getDashboardKPIs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUsageStats() {
  const { actor, isFetching } = useActor();
  return useQuery<UsageRecord[]>({
    queryKey: ["usageStats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUsageStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApiKeys() {
  const { actor, isFetching } = useActor();
  return useQuery<ApiKey[]>({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApiKeys();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keyName: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.generateApiKey(keyName);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["apiKeys"] }),
  });
}

export function useRevokeApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keyValue: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.revokeApiKey(keyValue);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["apiKeys"] }),
  });
}

export function useAvailableNumbers() {
  const { actor, isFetching } = useActor();
  return useQuery<AvailableNumber[]>({
    queryKey: ["availableNumbers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAvailableNumbers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyNumbers() {
  const { actor, isFetching } = useActor();
  return useQuery<OwnedNumber[]>({
    queryKey: ["myNumbers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyNumbers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchaseNumber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (numberId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.purchaseNumber(numberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableNumbers"] });
      queryClient.invalidateQueries({ queryKey: ["myNumbers"] });
    },
  });
}

export function useTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCredits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCredits(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardKPIs"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<ApiLog[]>({
    queryKey: ["logs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsRegistered() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isRegistered"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isRegistered();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["userProfile", "isRegistered"],
      }),
  });
}
