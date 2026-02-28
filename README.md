# Passive Income Timer

A responsive, debt-clock style web app that shows **real-time “money earned so far”** from a hypothetical investment (principal + APR), with toggles for daily, weekly, monthly, and yearly horizons.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to GitHub Pages

1. **Create a new repository** on GitHub (e.g. `passive-income-timer`).

2. **Enable GitHub Pages** for the repo:
   - Go to **Settings → Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**

3. **Push this project** to the repo (from your machine):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

4. The **Deploy to GitHub Pages** workflow will run on every push to `main`. After it finishes, the app will be live at:
   **`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`**

## Scripts

- **`npm run dev`** – Start dev server with HMR
- **`npm run build`** – TypeScript check + production build (output in `dist/`)
- **`npm run test`** – Run unit tests (Vitest)
- **`npm run test:watch`** – Run tests in watch mode

## How earnings are computed

- **Inputs:** Principal (P), APR (%), and compounding: none (simple), daily, monthly, or yearly.
- **Simple interest:**  
  `annualEarnings = P × (APR/100)`  
  `perSecond = annualEarnings / secondsPerYear`  
  `secondsPerYear = 365.2425 × 24 × 60 × 60`  
  For a given period, **earned so far** = `perSecond × elapsedSecondsInPeriod`.
- **Period boundaries (local time):**
  - **Daily:** from today 00:00:00
  - **Weekly:** from Monday 00:00:00 (ISO week)
  - **Monthly:** from 1st of month 00:00:00
  - **Yearly:** from Jan 1 00:00:00
- **Compounding:** For “so far” in a period we use the effective rate per period (daily/monthly/yearly) and compute value at “now” in that period minus value at period start (principal). So the number grows smoothly within the period and resets at the period boundary. See `src/utils/earnings.ts` for the formulas.

## Tech

- **Vite + React + TypeScript**, no backend.
- Calculation logic lives in `src/utils/` (time boundaries, earnings, format, storage); UI in `src/components/` and `App.tsx`.
- State (principal, APR, compounding, currency, start time) is persisted in `localStorage` and restored on refresh.
- The main counter updates every 0.25 seconds; invalid inputs show `$0.00` and highlight the field.
