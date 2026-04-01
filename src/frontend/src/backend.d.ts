import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ApiKey {
    status: Variant_active_revoked;
    createdDate: bigint;
    keyValue: string;
    keyName: string;
}
export interface AvailableNumber {
    id: string;
    country: string;
    numberType: Variant_sms_voice;
    number: string;
    monthlyCost: bigint;
}
export interface ApiLog {
    id: string;
    method: string;
    endpoint: string;
    userId: Principal;
    timestamp: bigint;
    statusCode: bigint;
    durationMs: bigint;
}
export interface UsageRecord {
    serviceType: Variant_sms_voice_whatsapp_email;
    cost: bigint;
    date: bigint;
    count: bigint;
}
export interface OwnedNumber {
    id: string;
    country: string;
    purchasedDate: bigint;
    numberType: Variant_sms_voice;
    number: string;
    monthlyCost: bigint;
}
export interface DashboardKPIs {
    totalMessages: bigint;
    uptime: bigint;
    creditBalance: bigint;
    totalApiCalls: bigint;
}
export interface UserProfile {
    accountSID: string;
    authToken: string;
    displayName: string;
    creditBalance: bigint;
}
export interface Transaction {
    id: string;
    transactionType: Variant_topup_deduction;
    description: string;
    timestamp: bigint;
    amount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_active_revoked {
    active = "active",
    revoked = "revoked"
}
export enum Variant_sms_voice {
    sms = "sms",
    voice = "voice"
}
export enum Variant_sms_voice_whatsapp_email {
    sms = "sms",
    voice = "voice",
    whatsapp = "whatsapp",
    email = "email"
}
export enum Variant_topup_deduction {
    topup = "topup",
    deduction = "deduction"
}
export interface backendInterface {
    addAvailableNumber(id: string, country: string, number: string, numberType: Variant_sms_voice, monthlyCost: bigint): Promise<void>;
    addCredits(amount: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    countUsers(): Promise<bigint>;
    generateApiKey(keyName: string): Promise<ApiKey>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardKPIs(): Promise<DashboardKPIs>;
    getLogs(): Promise<Array<ApiLog>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUsageStats(): Promise<Array<UsageRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isRegistered(): Promise<boolean>;
    listApiKeys(): Promise<Array<ApiKey>>;
    listAvailableNumbers(): Promise<Array<AvailableNumber>>;
    listMyNumbers(): Promise<Array<OwnedNumber>>;
    purchaseNumber(numberId: string): Promise<void>;
    revokeApiKey(keyValue: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProfile(displayName: string): Promise<void>;
}
