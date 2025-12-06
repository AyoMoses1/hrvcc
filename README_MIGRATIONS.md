# Database Migrations Guide

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables in `.env.local`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/membership
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret_key
```

## Running Migrations

Run the migration script to create all necessary tables:

```bash
pnpm migrate
```

Or manually run the SQL file:

```bash
psql $DATABASE_URL -f migrations/001_create_users_table.sql
```

## Database Schema

The migration creates:

- `users` table with all onboarding fields
- `documents` table for file uploads
- `services` table for user services
- Indexes for performance
- Triggers for automatic timestamp updates

## Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add them to `.env.local`

## Verification

After running migrations, verify the tables were created:

```bash
psql $DATABASE_URL -c "\dt"
```

You should see:

- users
- documents
- services
