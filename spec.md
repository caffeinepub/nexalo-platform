# Nexalo Platform

## Current State
New project with empty Motoko backend and default React frontend scaffolding.

## Requested Changes (Diff)

### Add
- Full landing page: hero, feature highlights, pricing tiers, CTA
- User authentication via authorization component
- Developer dashboard: welcome banner, KPI strip (messages sent, API calls, uptime, credits)
- API Key Management: generate, list, copy, revoke keys; Account SID / Auth Token display
- Usage Analytics: line chart (SMS/Voice/Email over 30 days), mini KPI tiles
- Account Overview: credit balance, trend chart, virtual phone numbers list
- Quick Actions: Send Test SMS, Buy Number, Check Docs
- Billing page: credit balance, add credits, transaction history
- Virtual phone number catalog: browse/purchase by country and type
- API documentation page: code examples for SMS, Voice, Email, WhatsApp, Verify
- Logs page: API request/response entries
- Support page
- Sidebar navigation: Dashboard, APIs, SMS, Voice, Email, WhatsApp, Verify, Logs, Analytics, Billing, Support
- Sample/mock data pre-loaded for all sections

### Modify
- Backend main.mo: add all data models and CRUD operations

### Remove
- Nothing (new project)

## Implementation Plan
1. Select authorization component
2. Generate Motoko backend with: user profiles, API keys, usage stats, credits, phone numbers, transactions, logs
3. Build React frontend with landing page, auth flow, and full dashboard
