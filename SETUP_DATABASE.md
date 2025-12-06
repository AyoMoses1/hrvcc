# Database Setup Guide

## Prerequisites

1. PostgreSQL installed and running
2. Node.js and pnpm installed

## Step 1: Install Dependencies

```bash
pnpm install
```

This will install:

- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `cloudinary` - Image/file upload service
- `jsonwebtoken` - JWT token generation
- `tsx` - TypeScript execution

## Step 2: Set Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/membership

# Cloudinary (Get from https://cloudinary.com/)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret (Use a strong random string in production)
JWT_SECRET=your_jwt_secret_key_change_in_production

# API URL (defaults to /api for Next.js API routes)
NEXT_PUBLIC_API_URL=/api
```

## Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE membership;

# Exit psql
\q
```

## Step 4: Run Migrations

Option 1: Using the migration script:

```bash
pnpm migrate
```

Option 2: Manually using psql:

```bash
psql $DATABASE_URL -f migrations/001_create_users_table.sql
```

## Step 5: Verify Tables

```bash
psql $DATABASE_URL -c "\dt"
```

You should see:

- users
- documents
- services

## Step 6: Test Registration

1. Start the development server:

```bash
pnpm dev
```

2. Navigate to `/auth/signup` or `/member-plans?signup=true`
3. Complete the onboarding form
4. Check the database:

```bash
psql $DATABASE_URL -c "SELECT id, email, name, category, business_name FROM users LIMIT 5;"
```

## Troubleshooting

### Connection Error

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure database exists

### Migration Errors

- Check if tables already exist: `\dt` in psql
- Drop tables if needed: `DROP TABLE IF EXISTS users, documents, services CASCADE;`
- Re-run migration

### Cloudinary Errors

- Verify credentials in `.env.local`
- Check Cloudinary dashboard for API keys
- Ensure account is active

### JWT Errors

- Set a strong JWT_SECRET in `.env.local`
- Restart the dev server after changing env vars
