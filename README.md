# Taxlity (All Countries, One Package)

- Salary + Freelancer tax calculators
- Country + FY selector (US 2025, UK FY 2025/26, CA 2025, AU FY 2025/26, PK FY 2026/27)
- Federal-only. Local currency symbols.
- SEO/Ads ready skeleton
- Deploy on Vercel

## How to run
```
npm i
npm run dev
```
Push to GitHub → Vercel → New Project → Import → Deploy.

## Update rules
Edit `/config/tax/{country}/{year}.json` and adjust brackets/deductions. Add FY label in `/lib/fiscal-years.ts` if you add more years.

## Disclaimer
Informational only. Not tax or legal advice.
