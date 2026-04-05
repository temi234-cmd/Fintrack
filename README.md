# FinTrack — Personal Finance Dashboard

A full-stack personal finance dashboard that helps users track income, expenses, budgets, and spending analytics in real time.

**Live Demo:** [fintrack-seven-lake.vercel.app](https://fintrack-seven-lake.vercel.app)  
**GitHub:** [github.com/temi234-cmd/Fintrack](https://github.com/temi234-cmd/Fintrack)

---

## Features

- **Authentication** — Email/password signup with email verification and Google OAuth
- **Transaction Tracking** — Add, edit, and delete income and expense transactions
- **Financial Dashboard** — Real-time total balance, monthly expenses, and savings rate
- **Analytics** — Spending breakdown by category, monthly trends, and income sources
- **Budget Management** — Set monthly budgets per category with overspend warnings
- **Multi-Currency Support** — Switch between 10+ currencies including NGN, USD, GBP, EUR
- **Responsive Design** — Fully optimised for mobile and desktop
- **Settings** — User profile and currency preferences saved to database

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Backend/Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth + Google OAuth |
| Charts | Recharts |
| Deployment | Vercel |

---

## Screenshots

### Landing Page
> Dark glassmorphism design with animated hero section and feature highlights

### Dashboard
> Real-time financial summary with income vs expenses line chart

### Transactions
> Full CRUD transaction management with search and filter

### Analytics
> Pie chart, bar chart, line chart and category breakdown

### Budgets
> Progress bars with colour-coded warnings at 80% and 100%

---

## Key Implementation Details

**Authentication Flow**
- JWT-based authentication managed by Supabase Auth
- Email verification required before dashboard access
- Google OAuth with automatic profile creation
- Protected routes redirect unauthenticated users to login

**Data Security**
- Row Level Security (RLS) enforced at the database level
- Users can only read and write their own data
- Environment variables used for all sensitive keys

**Financial Calculations**
- Total balance = all-time income minus all-time expenses
- Monthly figures filtered by current month and year
- Savings rate = (income - expenses) / income × 100
- Budget progress = category spending / budget limit × 100

---

## Deployment

The app is deployed on Vercel with automatic deployments on every push to `main`.

```
Root Directory:   frontend
Build Command:    npm run build
Output Directory: dist
```

---

## Roadmap

- [ ] AI financial insights using OpenAI API
- [ ] Bank account integration via Mono API
- [ ] PDF and CSV export
- [ ] Stripe payment simulation
- [ ] Savings goals and pockets
- [ ] Receipt scanning with OCR

---

## Author

**Oluwagbotemi**  
GitHub: [@temi234-cmd](https://github.com/temi234-cmd)  
Live: [fintrack-seven-lake.vercel.app](https://fintrack-seven-lake.vercel.app)
