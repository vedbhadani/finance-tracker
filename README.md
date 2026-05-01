# Fisher - Personal Finance Tracker

A robust, full-stack financial management system built with Node.js, Express, PostgreSQL, and React.

## Project Structure

```text
fisher/
├── backend/            # Express.js Server & PostgreSQL Integration
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── database/       # SQL setup scripts
│   ├── middleware/     # Auth & Error handling
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic & Database queries
│   └── uploads/        # Local storage for receipts
└── frontend/           # React + Vite Application
    ├── src/components/ # Reusable UI components
    ├── src/pages/      # Page-level components
    ├── src/services/   # API communication layer
    └── src/styles/     # Global & component styles
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env` (copy from `.env.example`).
4. Initialize the database:
   ```bash
   psql -U your_user -d your_db -f database/setup.sql
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Features
- **Secure Authentication**: JWT-based user login and registration.
- **Transaction Management**: Track income and expenses with category filtering.
- **Real-time Analytics**: Dashboard with summaries and Chart.js visualizations.
- **Budget Alerts**: Automated email notifications when budgets are exceeded.
- **Receipt Uploads**: Attach digital receipts to any transaction.
- **Multi-Currency Support**: Automated conversion to base currency (INR) via real-time exchange rates.
