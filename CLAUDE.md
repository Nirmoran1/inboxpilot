# InboxPilot

## What this is
An AI-powered email management tool that connects to Gmail, auto-triages incoming mail, surfaces what matters, and helps users clean up years of accumulated mess — without losing anything important. Built for normal people with overflowing inboxes, not power users.

## Who is building this
- Name: Nir
- Setup: Windows + PowerShell + Claude Desktop (Cowork mode)
- Level: Non-coder building with AI assistance
- Style: Minimal terminal, copy-paste-ready instructions, no lengthy explanations
- Role split: Nir gives orders and approves. Claude is the CEO/executor who builds.

## Token Optimization (Claude Code)
- Use `/model opusplan` — auto-switches: Opus plans, Sonnet executes.
- In plan mode: respond in 100 words or less.
- Saves ~35-45% of tokens per session (per Anthropic's own tests).

## The Problem
People with old, unmaintained inboxes (10+ years, 15,000+ emails) can't find what matters. Important emails get buried under promotions, duplicates, and newsletters. Setting up Gmail filters manually is tedious and most people don't know how. Existing tools focus on power users — this is for normal people.

## Target User (V1)
Nir himself. Non-technical, Israeli, Gmail user with 14,811 emails, ~201 unread, 50 labels mostly unused, inbox full of Hebrew + English mixed content.

## Core Principles (in this exact order of priority)

### 1. SAFETY — Don't lose anyone's stuff
- ⛔ NEVER auto-delete anything — archive only
- ⛔ NEVER take action without user seeing a preview first
- ✅ Every action has a 1-click "Undo" button
- ✅ "Dry run" mode — shows what WOULD happen without doing anything
- ✅ Full action log in Supabase with timestamps (exportable as CSV)
- ✅ Classification confidence scores — if AI isn't sure (<85%), flag for manual review
- ✅ Batch operations require explicit "Approve" click per batch
- ✅ "Are you sure?" confirmation on any action touching >50 emails

### 2. SECURITY — Protect private data
- ⛔ Emails are NEVER stored on our servers — read via Gmail API, classify in real-time
- ⛔ No email content sent to analytics, tracking, or third parties
- ⛔ OAuth tokens encrypted at rest, never exposed to frontend
- ✅ Claude API receives ONLY: subject + sender + snippet (not full body) — cheaper AND more private
- ✅ Classification results stored in Supabase with Row Level Security (RLS) — user can only see their own data
- ✅ Session timeout after 30 min inactivity, automatic token refresh
- ✅ GDPR-ready: user can revoke access → we delete ALL their data instantly
- ✅ All API routes require authenticated session — no public endpoints
- ✅ Rate limiting on all endpoints to prevent abuse
- ✅ Content Security Policy headers to prevent XSS

### 3. Everything else — features, UI, speed

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Supabase for auth + database (user preferences, action logs, classification cache)
- Gmail API for email access (OAuth 2.0)
- Claude API (Anthropic) for email classification
- Vercel for deployment
- next-intl for Hebrew/English i18n support

## V1 Core Features
1. **Connect Gmail** — OAuth flow, grant read/modify access
2. **AI Classification** — Scan and categorize ALL emails into 10 smart categories:
   - Important / Action Needed
   - Receipts & Bills
   - Job Search
   - Government & Official
   - Newsletters
   - Promotions / Junk
   - Dev Tools
   - Financial
   - Personal
   - Social
3. **Dashboard** — Email breakdown by category with counts, visual charts
4. **Safe Cleanup** — Suggest what to archive/unsubscribe. Preview before/after. User approves each batch. NEVER deletes.
5. **Auto-Labeling** — Apply Gmail labels based on AI classification
6. **Daily Digest** — Email or dashboard view: "Here's what needs your attention today"

## Done Checklist — V1
- [ ] Gmail OAuth connects successfully and reads emails
- [ ] AI correctly categorizes emails into 10+ categories (Hebrew + English)
- [ ] Dashboard shows email breakdown with real data and visual charts
- [ ] Safe cleanup mode works end-to-end (suggest → preview → approve → archive)
- [ ] Auto-labeling applies correct Gmail labels based on classification
- [ ] Full Hebrew and English support (UI, email parsing, RTL layout)
- [ ] Deployed live on Vercel with working production URL
- [ ] Security audit passed: no email content stored, OAuth tokens encrypted, RLS enforced

## Quality Bar — V1
- [ ] Would Nir show this to a friend without apologizing?
- [ ] Works on mobile without breaking?
- [ ] A non-technical user understands the UI within 5 seconds?
- [ ] No email is ever lost or deleted without explicit approval?
- [ ] Loads fast even with 15,000+ emails?

## What NOT to Build in V1
- Auto-reply
- Calendar integration
- Multi-account support
- Native mobile app (responsive web only)
- IMAP support (Gmail API only)
- Paid plan / billing / monetization

## V2 Ideas (don't touch until V1 ships)
- Auto-reply drafts for common email types
- Calendar integration (meeting invites → auto-RSVP)
- Multi-account (multiple Gmail accounts)
- Smart rules builder (visual Gmail filter creator)
- Email templates for quick replies
- Analytics over time (inbox health score)
- Slack/Telegram notifications
- Chrome extension for quick-triage from inbox

## Workflow Loop
This project follows the 5-step autonomous loop:
1. KICKOFF ✅ (completed)
2. BUILD ← current phase
3. CHECK — self-review against Done checklist AND Quality Bar before showing Nir
4. REVIEW — Nir approves or requests changes
5. LOG — update MEMORY.md, LESSONS.md, WINS.md

## Backup Strategy
Before any big change (new feature, refactor, deleting files):
→ Copy the current working version into: `_backups/YYYY-MM-DD_description/`
No Git needed. Just folder copies. Always do this. No exceptions.

## Guidelines (follow these — they shape quality)
- Prefer the simplest solution that works
- Always explain what you're doing before doing it
- Keep all language non-technical. Nir doesn't code.
- When stuck, stop and ask — don't guess
- Safety first — never do anything irreversible to a user's email
- Security second — never store or expose email content unnecessarily
- Hebrew support is not optional — it's core. RTL must work everywhere.
- Batch processing for 15K+ emails — never try to load all at once

## Non-Negotiable (enforced by skills — not optional)
- ⛔ NEVER delete or overwrite files without backing up first → enforced by checkpoint skill
- ⛔ NEVER show Nir anything without self-checking against Done checklist + Quality Bar → enforced by checkpoint skill
- ⛔ NEVER start a session without reading all 4 context files → enforced by session-start skill
- ⛔ NEVER end a session without running checkpoint → enforced by checkpoint skill
- ⛔ NEVER start building without a Done checklist → enforced by this kickoff skill
- ⛔ NEVER store full email body content — subject + sender + snippet only for classification
- ⛔ NEVER expose OAuth tokens to the frontend or client-side code

## Project Structure (planned)
```
inboxpilot/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Login, OAuth callback
│   │   ├── dashboard/          # Main dashboard
│   │   ├── cleanup/            # Safe cleanup flow
│   │   ├── digest/             # Daily digest view
│   │   └── api/                # API routes
│   │       ├── auth/           # Gmail OAuth endpoints
│   │       ├── classify/       # Claude API classification
│   │       ├── gmail/          # Gmail API wrapper
│   │       └── actions/        # Archive, label, undo endpoints
│   ├── components/             # Shared UI components (shadcn/ui)
│   ├── lib/                    # Utilities, API clients, types
│   │   ├── gmail.ts            # Gmail API client
│   │   ├── classify.ts         # Claude classification logic
│   │   ├── supabase.ts         # Supabase client + types
│   │   └── actions.ts          # Action log utilities
│   ├── i18n/                   # next-intl config
│   │   ├── en.json
│   │   └── he.json
│   └── types/                  # TypeScript type definitions
├── supabase/
│   └── migrations/             # Database schema
├── public/                     # Static assets
├── _backups/                   # Manual backups before big changes
├── .env.local                  # API keys (never commit)
└── package.json
```

## Key Technical Decisions
- **Pagination**: Gmail API returns max 500 results per request. Must paginate through all 14,811 emails.
- **Classification caching**: Store classification results in Supabase so we don't re-classify on every load.
- **Batch processing**: Classify emails in batches of 50-100 to stay within Claude API rate limits and manage costs.
- **Minimal data to AI**: Send ONLY subject + sender + snippet to Claude API. Never full body.
- **Action log**: Every archive/label action logged to Supabase with timestamp, email ID, action type, and undo capability.
- **RTL support**: Tailwind CSS `dir="rtl"` + next-intl for full Hebrew support.
- **Confidence scoring**: Each classification gets a confidence score. Below 85% = flagged for manual review.

## Current Status
V1 in progress. See MEMORY.md for latest decisions.

## Session Start Protocol
At the start of every session:
1. Read CLAUDE.md, MEMORY.md, LESSONS.md, WINS.md
2. Check Done checklist progress — how many boxes checked?
3. Summarize current state in 3 bullet points
4. Identify which workflow step we're in
5. Suggest the first action to take
