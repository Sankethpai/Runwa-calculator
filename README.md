# CashRunway 🚀

CashRunway is a frontend-only runway calculator built for startup founders to estimate how long their cash will last.

## Logic Used (As Required)

### Formula
Runway (Months) = Total Cash / Monthly Burn

### Thresholds
- Runway ≥ 6 months → Green (Positive state)
- Runway < 6 months → Yellow (Warning state)
- Runway < 3 months → Red (Urgent state)

## Pages
- `/` → Landing Page
- `/calculator` → Runway Calculator

## Features
- Landing page + calculator page
- Dark mode
- Currency toggle (INR / USD)
- Cash projection chart (Chart.js)
- Export runway report (.txt)
- LocalStorage persistence
- Mobile responsive UI

## Tech Stack
- React (Vite)
- TailwindCSS
- React Router DOM
- Chart.js

## Run Locally
```bash
npm install
npm run dev
```

## Deploy (Vercel)
Vercel works automatically. React Router refresh issues are fixed using `vercel.json`.
