# 2026 NCAA March Madness Bracket Simulator

Run 500 simulations of the real 2026 NCAA bracket. Get champion odds, upset alerts,
Cinderella picks, head-to-head stats, and fill out your own bracket.

---

## 🚀 Deploy to a Live Website (Step-by-Step)

### Step 1 — Install Node.js
If you don't have it: https://nodejs.org → download the LTS version and install it.

### Step 2 — Install dependencies
Open a terminal in this folder and run:
```
npm install
```

### Step 3 — Test it locally (optional)
```
npm run dev
```
Open http://localhost:5173 in your browser. You should see the full app.

### Step 4 — Push to GitHub
1. Go to https://github.com and create a free account if you don't have one
2. Create a new repository (call it `bracket-simulator` or anything you like)
3. In your terminal:
```
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 5 — Deploy on Vercel (free)
1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Import your GitHub repository
4. Leave all settings as default — Vercel auto-detects Vite
5. Click "Deploy"

That's it. Your site will be live at `https://your-repo-name.vercel.app` in about 60 seconds.

---

## 🌐 Add a Custom Domain (optional, ~$12/year)

1. Buy a domain at https://namecheap.com (e.g. `marchsimulator.com`)
2. In Vercel → your project → Settings → Domains
3. Add your domain and follow the DNS instructions (takes ~5 minutes)

Good domain ideas:
- marchsimulator.com
- bracketbomb.com
- ncaabracket2026.com
- simulatemadness.com

---

## 💰 Monetization Ideas

### Sportsbook Affiliate Links (highest upside)
Add affiliate links from FanDuel, DraftKings, or BetMGM next to champion odds.
You earn $50–200 per new depositing user they refer.
Sign up at: https://affiliates.fanduel.com

### Google AdSense
1. Go to https://adsense.google.com
2. Add your site and get approved (takes 1–7 days)
3. Add this script to index.html:
   `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_CLIENT_ID" crossorigin="anonymous"></script>`

### Email List
Add a simple email capture with https://mailchimp.com (free up to 500 subscribers).
Offer a "daily bracket update" and sell a sponsor slot ($200–500/email) to a betting app.

---

## 🛠 Local Development

```bash
npm install      # install dependencies
npm run dev      # start local dev server at localhost:5173
npm run build    # build for production (outputs to /dist)
npm run preview  # preview the production build locally
```

---

## Tech Stack
- React 18
- Vite 5
- 100% vanilla CSS-in-JS (no external UI libraries)
- Zero backend — runs entirely in the browser
