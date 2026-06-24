# ContractorPay 🏗️💰

**Fast payment platform for construction subcontractors.**

Invoice general contractors digitally, get paid in **24 hours** (vs. 45 days) via invoice factoring, and track lien rights automatically. Revenue model: **2.5% factoring fee**.

## Features

- **Digital Invoicing** — Send invoices to GCs from phone or laptop
- **Instant Factoring** — Get funded within 24 hours at 2.5% fee
- **Automatic Lien Rights** — Track lien deadlines automatically
- **Payment Tracking Dashboard** — See exactly where every payment stands
- **Cash Flow Insights** — View average payment times and trends
- **GC Management** — Keep all general contractors organized

## Tech Stack

- **Frontend**: React 18 + Vite 6 + Tailwind CSS + Lucide React icons
- **Backend Mock**: Built-in mock API for offline/demo mode
- **Deployment**: Vite build with CDN fallback

## Getting Started

```bash
cd vite_src
npm install
npm run dev
```

## Architecture

- `vite_src/src/App.jsx` — Main application (landing page + authenticated dashboard)
- `vite_src/src/mockApi.js` — Mock API returning realistic data when backend is unavailable
- The app tries the real backend API first, then falls back to mock data
- Landing page: Hero → Features → Pricing → Testimonials → Signup/Login
- Dashboard: KPI cards → Chart → Invoices table → Create invoice form → Contractors → Lien rights

## License

MIT