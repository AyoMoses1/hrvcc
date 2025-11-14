# 🚀 WeAfriq Setup Guide

Complete step-by-step guide to get your WeAfriq membership platform running.

## Prerequisites Checklist

- [ ] Node.js 18+ or 20+ installed
- [ ] PostgreSQL database (local or hosted)
- [ ] Package manager (pnpm recommended)
- [ ] Google Cloud Console account (for OAuth)
- [ ] Code editor (VS Code recommended)

## Step 1: Install Dependencies

```bash
cd membership-nextjs

# Using pnpm (recommended - faster)
pnpm install

# OR using npm
npm install

# OR using yarn
yarn install
```

## Step 2: Database Setup

### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (Mac)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb weafriq

# Your DATABASE_URL will be:
# postgresql://your-username@localhost:5432/weafriq
```

### Option B: Hosted Database (Recommended for Production)

**Supabase** (Free tier available):

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings > Database
4. Use the "Connection Pooling" URL for better performance

**Railway** (Free tier available):

1. Go to [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy DATABASE_URL from Variables tab

## Step 3: Environment Variables

Create `.env` file in the root:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-this>"  # Run: openssl rand -base64 32

# Google OAuth (Optional - see Step 4)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# App Config
NEXT_PUBLIC_APP_NAME="WeAfriq"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env` file.

## Step 4: Google OAuth Setup (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env`

## Step 5: Initialize Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Create database tables
pnpm prisma migrate dev --name init

# Open Prisma Studio to view database (optional)
pnpm prisma studio
```

## Step 6: Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## Step 7: Create First User

### Option A: Sign Up via UI

1. Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
2. Fill in details and select category
3. Sign up!

### Option B: Sign In with Google

1. Click "Continue with Google" on sign in page
2. Authenticate with your Google account
3. Redirects to dashboard

## Step 8: Create Admin User (Optional)

To access admin panel, create an admin user directly in database:

```bash
pnpm prisma studio
```

1. Open `User` table
2. Find your user
3. Change `role` from `PROFESSIONAL` to `ADMIN`
4. Save changes
5. Visit [http://localhost:3000/admin](http://localhost:3000/admin)

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
pnpm prisma db push
```

If fails:

- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify network access to database

### Authentication Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Restart dev server
pnpm dev
```

### Module Not Found Errors

```bash
# Regenerate Prisma Client
pnpm prisma generate

# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo
```

## Next Steps

✅ Customize branding in `lib/constants.ts`  
✅ Add your logo to `public/`  
✅ Modify theme colors in `tailwind.config.ts`  
✅ Extend database models in `prisma/schema.prisma`  
✅ Add seed data for testing

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

## Need Help?

Check the full documentation in [README.md](./README.md)

---

Happy building! 🚀

