# WeAfriq - Pan-African Professional Network

A world-class, enterprise-grade membership platform built with Next.js 14+, connecting Africa's professionals, businesses, and organizations.

## 🚀 Features

### Core Modules

- **🔐 Authentication** - NextAuth with Google OAuth, credentials, and role-based access
- **👤 Profiles** - Custom profiles for professionals, businesses, and organizations
- **🧭 Explore** - Advanced search with filters for discovering members
- **💼 Jobs** - Job posting, applications, and bookmarking system
- **💬 Messaging** - Real-time chat interface between members
- **📊 Dashboard** - Personalized dashboard with analytics and quick actions
- **🧑‍💼 Admin Panel** - Complete platform management and moderation tools
- **🤖 AI Matching** - Smart recommendation engine for connections

### Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + ShadCN/UI
- **Auth**: Custom JWT-based authentication
- **Database**: PostgreSQL with direct queries (pg library)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod Validation
- **Icons**: Lucide React
- **Theme**: next-themes (Dark/Light mode)

## 📦 Installation

### Prerequisites

- Node.js 18+ or 20+
- PostgreSQL database
- pnpm (recommended) or npm/yarn

### Setup

1. **Clone and Install**

```bash
cd membership-nextjs
pnpm install
```

2. **Environment Variables**

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/weafriq"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. **Database Setup**

```bash
# Run migrations
pnpm migrate

# Or manually:
psql $DATABASE_URL -f migrations/001_create_users_table.sql
```

4. **Run Development Server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
membership-nextjs/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (home, explore, jobs, about)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   ├── messages/          # Messaging interface
│   ├── profile/           # Public profiles
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── features/              # Feature modules
│   ├── auth/              # Auth components & logic
│   ├── dashboard/         # Dashboard components
│   ├── explore/           # Explore components
│   ├── jobs/              # Jobs components
│   ├── messages/          # Messaging components
│   ├── profiles/          # Profile components
│   └── admin/             # Admin components
├── components/            # Shared components
│   ├── ui/                # ShadCN/UI components
│   ├── layout/            # Layout components
│   ├── providers.tsx      # App providers
│   └── theme-toggle.tsx   # Theme switcher
├── lib/                   # Utilities & config
│   ├── auth.ts            # NextAuth config
│   ├── auth.config.ts     # Auth configuration
│   ├── db.ts              # Prisma client
│   ├── utils.ts           # Utility functions
│   ├── constants.ts       # App constants
│   ├── ai/                # AI matching logic
│   ├── data/              # Mock data
│   ├── types/             # TypeScript types
│   └── validations/       # Zod schemas
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts
│   ├── use-debounce.ts
│   └── use-media-query.ts
├── migrations/            # SQL migration files
│   └── 001_create_users_table.sql
├── middleware.ts          # Route protection
└── package.json
```

## 🔑 Key Features Explained

### Authentication System

- **Multi-Provider**: Credentials & Google OAuth
- **Role-Based**: Admin, Professional, Business, Organization
- **Protected Routes**: Middleware-based route protection
- **Session Management**: JWT with secure session handling

### User Roles

- **Professional**: Individual freelancers, consultants
- **Business**: Companies and startups
- **Organization**: NGOs, associations, institutions
- **Admin**: Platform administrators

### Profiles Module

- Public profile pages with shareable URLs
- Category-specific profile schemas
- Skills and services showcase
- Verification badges
- Profile statistics and analytics

### Jobs Module

- Job posting for businesses/organizations
- Application submission with cover letter & resume
- Bookmark system for saving jobs
- Advanced filtering (type, location, category)

### Admin Panel

- User management (verify, suspend, delete)
- Platform analytics and metrics
- Content moderation
- Job listing oversight
- System settings

### AI Matching

Rule-based recommendation engine matching users by:

- Geographic location
- Skills and services overlap
- Professional category
- Verification status
- User ratings

## 🎨 UI Components

All UI components built with ShadCN/UI:

- Button, Card, Badge, Input, Label
- Select, Dropdown Menu, Sheet, Tabs
- Avatar, Skeleton (loading states)
- Toast notifications (Sonner)
- Theme toggle (Dark/Light)

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
pnpm type-check   # TypeScript type checking
```

### Code Quality

- **ESLint**: Next.js + TypeScript rules
- **Prettier**: Code formatting with Tailwind plugin
- **TypeScript**: Strict mode enabled
- **Husky**: Git hooks for pre-commit checks (optional)

## 📚 API Routes

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Users (Protected)

- `GET /api/users` - List users
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user

### Jobs (Protected)

- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `POST /api/jobs/[id]/apply` - Apply to job

### Messages (Protected)

- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

### Environment Variables

Set these in your deployment platform:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Database

Ensure PostgreSQL is accessible from your deployment environment. For production, consider:

- **Vercel Postgres**
- **Supabase**
- **Railway**
- **PlanetScale**

## 🤝 Contributing

This is a production-ready template. To customize:

1. Update branding in `lib/constants.ts`
2. Modify color scheme in `tailwind.config.ts`
3. Add your database migrations to `migrations/` directory
4. Extend features in respective `features/` modules

## 📝 License

MIT License - feel free to use for commercial projects.

## 🙏 Credits

- Built with [Next.js](https://nextjs.org/)
- UI by [ShadCN/UI](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Auth by [NextAuth.js](https://next-auth.js.org/)

---

**WeAfriq** - Connecting Africa's Future 🌍
