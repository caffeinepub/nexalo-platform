import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type (required by frontend)
  public type UserProfile = {
    displayName : Text;
    accountSID : Text;
    authToken : Text;
    creditBalance : Nat;
  };

  // API Key Type
  public type ApiKey = {
    keyName : Text;
    keyValue : Text;
    createdDate : Int;
    status : { #active; #revoked };
  };

  // Virtual Phone Number Type
  public type AvailableNumber = {
    id : Text;
    country : Text;
    number : Text;
    numberType : { #voice; #sms };
    monthlyCost : Nat;
  };

  public type OwnedNumber = {
    id : Text;
    country : Text;
    number : Text;
    numberType : { #voice; #sms };
    monthlyCost : Nat;
    purchasedDate : Int;
  };

  // Usage Stats Type
  public type UsageRecord = {
    date : Int;
    serviceType : { #sms; #voice; #email; #whatsapp };
    count : Nat;
    cost : Nat;
  };

  // Transaction Type
  public type Transaction = {
    id : Text;
    timestamp : Int;
    transactionType : { #topup; #deduction };
    amount : Nat;
    description : Text;
  };

  // API Log Type
  public type ApiLog = {
    id : Text;
    timestamp : Int;
    method : Text;
    endpoint : Text;
    statusCode : Nat;
    durationMs : Nat;
    userId : Principal;
  };

  // Dashboard KPIs Type
  public type DashboardKPIs = {
    totalMessages : Nat;
    totalApiCalls : Nat;
    creditBalance : Nat;
    uptime : Nat;
  };

  // State storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userApiKeys = Map.empty<Principal, [ApiKey]>();
  let availableNumbers = Map.empty<Text, AvailableNumber>();
  let ownedNumbers = Map.empty<Principal, [OwnedNumber]>();
  let usageStats = Map.empty<Principal, [UsageRecord]>();
  let transactions = Map.empty<Principal, [Transaction]>();
  let apiLogs = Map.empty<Text, ApiLog>();
  
  var isSeeded = false;
  var nextLogId = 0;
  var nextTransactionId = 0;

  // Helper function to generate unique IDs
  func generateId(prefix : Text, counter : Nat) : Text {
    prefix # counter.toText();
  };

  // Seed sample data on first use
  func seedData() {
    if (isSeeded) { return };
    
    // Seed available numbers
    availableNumbers.add("num1", {
      id = "num1";
      country = "US";
      number = "+1-555-0001";
      numberType = #sms;
      monthlyCost = 100;
    });
    availableNumbers.add("num2", {
      id = "num2";
      country = "US";
      number = "+1-555-0002";
      numberType = #voice;
      monthlyCost = 150;
    });
    availableNumbers.add("num3", {
      id = "num3";
      country = "UK";
      number = "+44-20-0001";
      numberType = #sms;
      monthlyCost = 120;
    });
    
    isSeeded := true;
  };

  // Initialize seed data
  seedData();

  // ===== USER PROFILE OPERATIONS =====

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateProfile(displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found. Please create a profile first.") };
      case (?existing) {
        let updated : UserProfile = {
          displayName = displayName;
          accountSID = existing.accountSID;
          authToken = existing.authToken;
          creditBalance = existing.creditBalance;
        };
        userProfiles.add(caller, updated);
      };
    };
  };

  // ===== API KEY OPERATIONS =====

  public shared ({ caller }) func generateApiKey(keyName : Text) : async ApiKey {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate API keys");
    };

    let keyValue = "sk_" # caller.toText() # "_" # Int.abs(Time.now()).toText();
    let newKey : ApiKey = {
      keyName = keyName;
      keyValue = keyValue;
      createdDate = Time.now();
      status = #active;
    };

    let existingKeys = switch (userApiKeys.get(caller)) {
      case (null) { [] };
      case (?keys) { keys };
    };

    userApiKeys.add(caller, existingKeys.concat([newKey]));
    newKey;
  };

  public query ({ caller }) func listApiKeys() : async [ApiKey] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list API keys");
    };

    switch (userApiKeys.get(caller)) {
      case (null) { [] };
      case (?keys) { keys };
    };
  };

  public shared ({ caller }) func revokeApiKey(keyValue : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can revoke API keys");
    };

    switch (userApiKeys.get(caller)) {
      case (null) { Runtime.trap("No API keys found") };
      case (?keys) {
        let updatedKeys = keys.map(func(key) {
          if (key.keyValue == keyValue) {
            { keyName = key.keyName; keyValue = key.keyValue; createdDate = key.createdDate; status = #revoked };
          } else {
            key;
          };
        });
        userApiKeys.add(caller, updatedKeys);
      };
    };
  };

  // ===== VIRTUAL PHONE NUMBER OPERATIONS =====

  public query ({ caller }) func listAvailableNumbers() : async [AvailableNumber] {
    // Any authenticated user can view available numbers
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list available numbers");
    };

    availableNumbers.values().toArray();
  };

  public shared ({ caller }) func purchaseNumber(numberId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase numbers");
    };

    switch (availableNumbers.get(numberId)) {
      case (null) { Runtime.trap("Number not available") };
      case (?availNum) {
        // Check if user has enough credits
        switch (userProfiles.get(caller)) {
          case (null) { Runtime.trap("User profile not found") };
          case (?profile) {
            if (profile.creditBalance < availNum.monthlyCost) {
              Runtime.trap("Insufficient credits");
            };

            // Deduct cost from balance
            let updatedProfile : UserProfile = {
              displayName = profile.displayName;
              accountSID = profile.accountSID;
              authToken = profile.authToken;
              creditBalance = profile.creditBalance - availNum.monthlyCost;
            };
            userProfiles.add(caller, updatedProfile);

            // Add to owned numbers
            let ownedNum : OwnedNumber = {
              id = availNum.id;
              country = availNum.country;
              number = availNum.number;
              numberType = availNum.numberType;
              monthlyCost = availNum.monthlyCost;
              purchasedDate = Time.now();
            };

            let existingOwned = switch (ownedNumbers.get(caller)) {
              case (null) { [] };
              case (?nums) { nums };
            };
            ownedNumbers.add(caller, existingOwned.concat([ownedNum]));

            // Remove from available
            availableNumbers.remove(numberId);

            // Record transaction
            let txn : Transaction = {
              id = generateId("txn_", nextTransactionId);
              timestamp = Time.now();
              transactionType = #deduction;
              amount = availNum.monthlyCost;
              description = "Purchased number " # availNum.number;
            };
            nextTransactionId += 1;

            let existingTxns = switch (transactions.get(caller)) {
              case (null) { [] };
              case (?txns) { txns };
            };
            transactions.add(caller, existingTxns.concat([txn]));
          };
        };
      };
    };
  };

  public query ({ caller }) func listMyNumbers() : async [OwnedNumber] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list their numbers");
    };

    switch (ownedNumbers.get(caller)) {
      case (null) { [] };
      case (?nums) { nums };
    };
  };

  // ===== USAGE STATS OPERATIONS =====

  public query ({ caller }) func getUsageStats() : async [UsageRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view usage stats");
    };

    switch (usageStats.get(caller)) {
      case (null) { [] };
      case (?stats) {
        // Filter last 30 days
        let thirtyDaysAgo = Time.now() - (30 * 24 * 60 * 60 * 1_000_000_000);
        stats.filter<UsageRecord>(func(record) {
          record.date >= thirtyDaysAgo;
        });
      };
    };
  };

  // ===== TRANSACTION OPERATIONS =====

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?txns) { txns };
    };
  };

  public shared ({ caller }) func addCredits(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add credits");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          displayName = profile.displayName;
          accountSID = profile.accountSID;
          authToken = profile.authToken;
          creditBalance = profile.creditBalance + amount;
        };
        userProfiles.add(caller, updatedProfile);

        // Record transaction
        let txn : Transaction = {
          id = generateId("txn_", nextTransactionId);
          timestamp = Time.now();
          transactionType = #topup;
          amount = amount;
          description = "Credit top-up";
        };
        nextTransactionId += 1;

        let existingTxns = switch (transactions.get(caller)) {
          case (null) { [] };
          case (?txns) { txns };
        };
        transactions.add(caller, existingTxns.concat([txn]));
      };
    };
  };

  // ===== API LOG OPERATIONS =====

  public query ({ caller }) func getLogs() : async [ApiLog] {
    // Only admins can view all logs
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view API logs");
    };

    apiLogs.values().toArray();
  };

  // Helper function to log API calls (would be called internally)
  func logApiCall(userId : Principal, method : Text, endpoint : Text, statusCode : Nat, durationMs : Nat) {
    let log : ApiLog = {
      id = generateId("log_", nextLogId);
      timestamp = Time.now();
      method = method;
      endpoint = endpoint;
      statusCode = statusCode;
      durationMs = durationMs;
      userId = userId;
    };
    nextLogId += 1;
    apiLogs.add(log.id, log);
  };

  // ===== DASHBOARD KPI OPERATIONS =====

  public query ({ caller }) func getDashboardKPIs() : async DashboardKPIs {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard KPIs");
    };

    let creditBalance = switch (userProfiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.creditBalance };
    };

    let totalMessages = switch (usageStats.get(caller)) {
      case (null) { 0 };
      case (?stats) {
        stats.foldLeft(0, func(acc, record) {
          acc + record.count;
        });
      };
    };

    let totalApiCalls = switch (usageStats.get(caller)) {
      case (null) { 0 };
      case (?stats) { stats.size() };
    };

    {
      totalMessages = totalMessages;
      totalApiCalls = totalApiCalls;
      creditBalance = creditBalance;
      uptime = 99; // Mock uptime percentage
    };
  };

  // ===== ADMIN OPERATIONS =====

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userProfiles.values().toArray();
  };

  public shared ({ caller }) func addAvailableNumber(
    id : Text,
    country : Text,
    number : Text,
    numberType : { #voice; #sms },
    monthlyCost : Nat
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add available numbers");
    };

    let newNumber : AvailableNumber = {
      id = id;
      country = country;
      number = number;
      numberType = numberType;
      monthlyCost = monthlyCost;
    };
    availableNumbers.add(id, newNumber);
  };

  // ===== PUBLIC QUERY OPERATIONS (No auth required) =====

  public query ({ caller }) func countUsers() : async Nat {
    userProfiles.size();
  };

  public query ({ caller }) func isRegistered() : async Bool {
    userProfiles.containsKey(caller);
  };
};
