# API Integration Guide

## Overview
The frontend is now fully integrated with the NestJS backend API using Axios and React Query.

## Setup

### 1. Environment Variables
Create a `.env.local` file in the `membership-nextjs` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 2. Start the Backend
```bash
cd membership-backend
pnpm install
pnpm run seed  # Optional: Seed the database
pnpm run start:dev
```

The backend will run on `http://localhost:4000/api`

### 3. Start the Frontend
```bash
cd membership-nextjs
pnpm install
pnpm dev -- --port 3001
```

The frontend will run on `http://localhost:3001`

## API Structure

### Axios Configuration
- **Location**: `lib/api/axios.ts`
- **Features**:
  - Automatic error handling with toast notifications
  - Request/response interceptors
  - Configurable base URL from environment variables
  - 30-second timeout

### API Services

#### Events API (`lib/api/events.ts`)
- `getAll(params)` - Get all events with filters
- `getById(id)` - Get single event
- `create(data)` - Create new event
- `update(id, data)` - Update event
- `delete(id)` - Delete event

#### Member Plans API (`lib/api/member-plans.ts`)
- `getAll(params)` - Get all member plans with pagination
- `getById(id)` - Get single member plan
- `create(data)` - Create new member plan
- `update(id, data)` - Update member plan
- `delete(id)` - Delete member plan

### React Query Hooks

#### Events Hooks (`hooks/use-events.ts`)
- `useEvents(filters)` - Fetch events with filters
- `useEvent(id)` - Fetch single event
- `useCreateEvent()` - Create event mutation
- `useUpdateEvent()` - Update event mutation
- `useDeleteEvent()` - Delete event mutation

#### Member Plans Hooks (`hooks/use-member-plans.ts`)
- `useMemberPlans(params)` - Fetch member plans with pagination
- `useMemberPlan(id)` - Fetch single member plan
- `useCreateMemberPlan()` - Create member plan mutation
- `useUpdateMemberPlan()` - Update member plan mutation
- `useDeleteMemberPlan()` - Delete member plan mutation

## Integrated Pages

### Events Page (`/events`)
- ✅ Fetches events from API
- ✅ Real-time filtering (category, search, date)
- ✅ Create new events
- ✅ Loading and error states
- ✅ Calendar integration with event highlights

### Member Plans Page (`/member-plans`)
- ✅ Fetches member plans from API
- ✅ Create new member plans
- ✅ Loading and error states
- ✅ CSV export functionality

## Error Handling

All API errors are automatically handled:
- Network errors show "Network error" toast
- 401 errors show "Unauthorized" toast
- 404 errors show "Resource not found" toast
- 500 errors show "Server error" toast
- Validation errors show specific error messages

## Testing

### Test Events Endpoint
```bash
# Get all events
curl http://localhost:4000/api/events

# Get filtered events
curl "http://localhost:4000/api/events?category=Networking&upcomingOnly=true"

# Create event
curl -X POST http://localhost:4000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "Test Description",
    "date": "2024-12-25",
    "category": "Networking"
  }'
```

### Test Member Plans Endpoint
```bash
# Get all member plans
curl http://localhost:4000/api/member-plans

# Create member plan
curl -X POST http://localhost:4000/api/member-plans \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Basic",
    "name": "Starter Plan",
    "pricing": {
      "monthly": 29.99
    },
    "features": ["Feature 1", "Feature 2"]
  }'
```

## Notes

- All API calls use React Query for caching and state management
- Mutations automatically invalidate queries to refresh data
- Date objects are properly converted from ISO strings
- Loading states are handled with spinners
- Error states show user-friendly messages


