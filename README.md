# HighTicketBoard — Setter & Closer Job Board

A Next.js job board for high-ticket remote sales roles: DM setting, phone setting, and closing. Ships with 27 real offers sourced from public job boards (Aug 2026), a detailed niche taxonomy, and full filtering.

## Deploy to Vercel (step by step)

### Option A — GitHub + Vercel (recommended, enables auto-redeploys)

1. Create a free account at github.com if you don't have one, and at vercel.com (sign up **with GitHub**).
2. On GitHub, click **New repository**, name it `highticket-board`, keep it Private, and create it.
3. Upload this project: on the new repo page click **uploading an existing file**, then drag in ALL the files/folders from this project EXCEPT `node_modules` and `.next` (if present). Commit.
   - Or with git installed: `git init && git add . && git commit -m "launch" && git remote add origin <your repo URL> && git push -u origin main`
4. Go to vercel.com → **Add New… → Project** → Import your `highticket-board` repo.
5. Vercel auto-detects Next.js. Don't change any settings. Click **Deploy**.
6. ~60 seconds later you get a live URL like `highticket-board.vercel.app`. Done.

From now on, any change you push to GitHub redeploys automatically.

### Option B — Vercel CLI (no GitHub)

1. Install Node.js from nodejs.org if you don't have it.
2. In this project folder run: `npx vercel` — log in when prompted, accept the defaults.
3. Run `npx vercel --prod` to push it live.

### Custom domain

Vercel dashboard → your project → **Settings → Domains** → add `yourdomain.com` and follow the DNS instructions (usually one A record + one CNAME at your registrar). SSL is automatic.

## How to add or edit a job

Everything lives in **`data/jobs.js`**. Copy any job block, paste it at the top of the `JOBS` array, edit the fields, save, push/redeploy. The field guide is in comments at the top of that file. Niche categories and sub-niches are in the `NICHES` object in the same file — add new ones there and they appear in the filters automatically.

## Run locally

```
npm install
npm run dev      # http://localhost:3000
```

## Ideas for v2

- Paid "featured" listings (Stripe payment link + a `featured: true` flag)
- Email capture for a weekly offers newsletter (add a ConvertKit/Beehiiv embed)
- Admin dashboard with a database (Vercel Postgres/Supabase) when hand-editing gets old
- Auto-refresh listings via a scheduled scrape

## Disclaimer

Compensation figures are as posted by hiring companies on public job boards and are not guaranteed. Listings link to their public sources.
