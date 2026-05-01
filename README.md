# Fisher Backend API

A production-ready Node.js backend using Express and PostgreSQL.

## Project Structure

```text
fisher/
├── config/             # Database and other configurations
├── controllers/        # Request handlers
├── middleware/         # Custom Express middleware
├── models/             # Database models/schemas
├── routes/             # API routes
├── utils/              # Utility functions
├── app.js              # Express app setup
├── server.js           # Server entry point
└── .env                # Environment variables
```

## Features

- **Express.js**: Fast, unopinionated, minimalist web framework.
- **PostgreSQL**: Robust relational database using `pg`.
- **Security**: Includes `helmet` for security headers, `cors`, and **JWT-based Authentication**.
- **Password Hashing**: Secure password storage using `bcryptjs`.
- **Database**: PostgreSQL integration with SQL setup scripts for the `users` table.
- **Logging**: Console-based request logging using `morgan`.
- **Error Handling**: Global error handling middleware for consistent API responses.
- **Environment Variables**: Managed via `dotenv`.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) database

## Getting Started

1. **Clone the repository** (if applicable) or navigate to the project folder.

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

4. **Run the application**:
   - **Development mode** (with hot reloading):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

## API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Authentication (Private)

- `GET /api/auth/profile` - Get current user profile (requires Bearer token)

### Categories (Private)

- `POST /api/categories` - Create a new category
- `GET /api/categories` - List all categories for the user
- `DELETE /api/categories/:id` - Delete a category

### Transactions (Private)

- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions` - List transactions (supports filters: `category_id`, `startDate`, `endDate`)
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `POST /api/transactions/:id/receipt` - Upload a receipt (Multipart/form-data, field: `receipt`)

### Dashboard (Private)

- `GET /api/dashboard` - Get financial summary (Total Income, Total Expense, Savings)

### Reports (Private)

- `GET /api/reports/monthly?month=X&year=Y` - Get detailed monthly report with category breakdown

### Budgets (Private)

- `POST /api/budgets` - Set or update a budget for a category
- `GET /api/budgets?month=X&year=Y` - List budgets with current usage and exceeding status

### General

- **Health Check**: `GET /health`
- **Root**: `GET /`

## Future Scaling

- Add **Validation** using `joi` or `express-validator`.
- Add **Documentation** using `Swagger` (OpenAPI).
- Add **Unit/Integration Tests** using `Jest` and `Supertest`.
