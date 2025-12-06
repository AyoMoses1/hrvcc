# Testing Guide

## Prerequisites

1. PostgreSQL database running
2. Environment variables set in `.env.local`
3. Dependencies installed: `pnpm install`

## Step 1: Test Database Connection

```bash
pnpm test-db
```

This will:

- Test database connectivity
- List all tables
- Show users table structure
- Count existing users

Expected output:

```
✅ Database connection successful!
Current time: 2024-01-01 12:00:00
PostgreSQL version: PostgreSQL 15.0

📊 Existing tables:
  - documents
  - services
  - users

📋 Users table columns (first 10):
  - id (varchar) NOT NULL
  - email (varchar) NOT NULL
  - password (varchar) NOT NULL
  ...
```

## Step 2: Run Migrations (if not done)

```bash
pnpm migrate
```

Or manually:

```bash
psql $DATABASE_URL -f migrations/001_create_users_table.sql
```

## Step 3: Test Registration API

### Using curl:

```bash
# Create a test JSON payload
cat > test-register.json << 'EOF'
{
  "email": "test@example.com",
  "password": "testpassword123",
  "name": "Test User",
  "category": "Business",
  "businessName": "Test Business",
  "firstName": "Test",
  "lastName": "User",
  "city": "Houston",
  "state": "Texas",
  "zip": "77099"
}
EOF

# Create FormData and test
curl -X POST http://localhost:3000/api/auth/register \
  -F "data=@test-register.json" \
  -H "Content-Type: multipart/form-data"
```

### Using the UI:

1. Start dev server: `pnpm dev`
2. Navigate to: `http://localhost:3000/member-plans?signup=true`
3. Select a plan
4. Fill out the onboarding form
5. Submit and verify data is saved

## Step 4: Verify Data in Database

```bash
psql $DATABASE_URL -c "SELECT id, email, name, category, business_name, city, state FROM users LIMIT 5;"
```

## Step 5: Test File Uploads

1. Complete onboarding form with:
   - Profile photo
   - Documents (DD-214, etc.)
2. Check Cloudinary dashboard for uploaded files
3. Verify document URLs in database:

```sql
SELECT d.file_name, d.file_url, d.file_type
FROM documents d
JOIN users u ON d.user_id = u.id
WHERE u.email = 'test@example.com';
```

## Troubleshooting

### Database Connection Error

- Check DATABASE_URL format
- Verify PostgreSQL is running: `pg_isready`
- Test connection: `psql $DATABASE_URL -c "SELECT 1;"`

### Migration Errors

- Check if tables exist: `\dt` in psql
- Drop and recreate if needed:
  ```sql
  DROP TABLE IF EXISTS documents, services, users CASCADE;
  ```
- Re-run migration

### API Errors

- Check server logs for detailed errors
- Verify all environment variables are set
- Test database connection separately
- Check Cloudinary credentials

### File Upload Errors

- Verify Cloudinary credentials in `.env.local`
- Check file size limits
- Verify file types are allowed
- Check Cloudinary dashboard for errors
