# ⚡ LeetLog

**Auto-track your LeetCode solves. Get AI revision cards. Never forget a pattern.**

> Free forever · Self-hostable · Deploy to Vercel in 5 minutes

---

## What it does

- Connects to your LeetCode username and **auto-imports accepted submissions every hour**
- Generates an **AI Essence Card** for each solve (pattern, intuition, your approach vs optimal, TC/SC, gotchas)
- **Spaced repetition** (FSRS algorithm) schedules revision so you review problems right before you'd forget them
- **Blind recall sessions** — flip-card mode, rate your recall, track your progress
- **Analytics** — pattern heatmap, difficulty breakdown, weekly review trends
- **Weekly email digest** — due cards, streak, weakest pattern, every Sunday

---

## Setup (5 minutes)

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/leetlog
cd leetlog
npm install
```

### 2. Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run everything in `supabase/schema.sql`
3. Go to **Authentication → Providers** and enable **Google** (add your OAuth credentials) and/or **Email**
4. Copy your project URL and keys

### 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=digest@yourdomain.com

CRON_SECRET=any-random-string-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Get your Groq API key

1. Go to [console.groq.com](https://console.groq.com) (free account)
2. Create an API key
3. In LeetLog → Settings → paste your key

### 6. Deploy to Vercel

```bash
# Push to GitHub first, then:
```

1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Add all env variables (same as `.env.local` but set `NEXT_PUBLIC_APP_URL` to your Vercel URL)
3. Deploy ✅

The cron job (`vercel.json`) will automatically sync LeetCode every hour for all users.

---

## How the sync works

1. You set your LeetCode username in Settings
2. We call LeetCode's public GraphQL API to fetch your recent accepted submissions
3. Each new submission gets saved as a card (pending)
4. Groq AI reads the problem metadata and generates an Essence Card
5. FSRS schedules when you should review it next

> **Note:** LeetCode's API doesn't return your actual submitted code (they don't expose it publicly). Cards are generated from problem title, difficulty, and topic tags.

---

## Stack

| | |
|---|---|
| Framework | Next.js 14 App Router |
| Auth + DB | Supabase (free tier) |
| AI | Groq API — llama-3.3-70b-versatile (free) |
| Email | Resend (3000 emails/month free) |
| Spaced Rep | FSRS v4 (pure TypeScript) |
| Charts | Recharts |
| Deploy | Vercel (free) |

---

## Contributing

PRs welcome. Open an issue first for big changes.

---

## License

MIT
