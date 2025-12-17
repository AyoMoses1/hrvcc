'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Briefcase,
  Eye,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import { Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AnalyticsPage() {
  const { data: usersData, isLoading: usersLoading } = useUsers({ page: 1, limit: 1000 });
  const users = usersData?.data || [];

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/events');
        return data?.data || data || [];
      } catch {
        return [];
      }
    },
  });

  const events = eventsData || [];

  if (usersLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const businesses = users.filter((u: any) => u.category === 'Business').length;
  const organizations = users.filter((u: any) => u.category === 'Organization').length;
  const staff = users.filter((u: any) => u.category === 'Staff').length;
  const verified = users.filter((u: any) => u.verified).length;

  const categoryData = [
    { name: 'Businesses', value: businesses, color: COLORS[0] },
    { name: 'Organizations', value: organizations, color: COLORS[1] },
    { name: 'Staff', value: staff, color: COLORS[2] },
  ];

  const monthlyRegistrations = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i, 1);
    const monthUsers = users.filter((u: any) => {
      try {
        const userDate = new Date(u.joinedDate || u.createdAt || Date.now());
        return userDate.getMonth() === i && userDate.getFullYear() === 2024;
      } catch {
        return false;
      }
    }).length;
    return {
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      users: monthUsers,
    };
  });

  const locationData = users.reduce((acc: Record<string, number>, user: any) => {
    const location = user.location?.split(',')[0] || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const topLocations = Object.entries(locationData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const eventCategories = events.reduce((acc: Record<string, number>, event: any) => {
    const cat = event.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const eventCategoryData = Object.entries(eventCategories).map(([name, value]) => ({
    name,
    value,
  }));

  const stats = [
    {
      label: 'Total Users',
      value: users.length.toLocaleString(),
      icon: Users,
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Active Organizations',
      value: organizations.toLocaleString(),
      icon: CheckCircle,
      change: `${Math.round((organizations / users.length) * 100) || 0}%`,
      trend: 'up',
    },
    {
      label: 'Total Events',
      value: events.length.toLocaleString(),
      icon: Calendar,
      change: '+5',
      trend: 'up',
    },
    {
      label: 'Active Businesses',
      value: businesses.toLocaleString(),
      icon: Building2,
      change: '+8%',
      trend: 'up',
    },
  ];

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights into your platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">{stat.change}</span> from last period
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Registrations Over Time</CardTitle>
            <CardDescription>Monthly user growth in 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#0088FE"
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Categories Distribution</CardTitle>
            <CardDescription>Breakdown by member type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Members by location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLocations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>Distribution of events by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verified</span>
                <span className="text-lg font-semibold">{verified}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(verified / users.length) * 100 || 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unverified</span>
                <span className="text-lg font-semibold">{users.length - verified}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = users.filter((u: any) => Math.round(u.rating || 0) === rating).length;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-12 text-sm">{rating}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${(count / users.length) * 100 || 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Rating</span>
                <span className="text-lg font-semibold">
                  {users.length > 0
                    ? (
                        users.reduce((sum: number, u: any) => sum + (u.rating || 0), 0) /
                        users.length
                      ).toFixed(1)
                    : '0.0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Reviews</span>
                <span className="text-lg font-semibold">
                  {users
                    .reduce((sum: number, u: any) => sum + (u.reviews || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Members with Services</span>
                <span className="text-lg font-semibold">
                  {users.filter((u: any) => u.services && u.services.length > 0).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
