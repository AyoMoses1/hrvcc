'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Briefcase, AlertCircle, TrendingUp, Eye } from 'lucide-react';
import { adminStats } from '@/lib/data/mock-data';

export function AdminDashboard() {
  const stats = [
    {
      label: 'Total Users',
      value: adminStats.totalUsers.toLocaleString(),
      icon: Users,
      change: '+' + adminStats.newUsersThisMonth,
    },
    {
      label: 'Professionals',
      value: adminStats.totalProfessionals.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Businesses',
      value: adminStats.totalBusinesses.toLocaleString(),
      icon: Building2,
    },
    {
      label: 'Active Jobs',
      value: adminStats.totalJobs.toLocaleString(),
      icon: Briefcase,
    },
    {
      label: 'Active Users',
      value: adminStats.activeUsers.toLocaleString(),
      icon: TrendingUp,
    },
    {
      label: 'Revenue',
      value: '$' + (adminStats.revenue || 0).toLocaleString(),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {stat.change && (
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary">{stat.change}</span> this month
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['John Doe', 'Jane Smith', 'Tech Innovations', 'Green Energy Co.'].map(
                (name, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? 'Just now' : `${i * 2} hours ago`}
                      </p>
                    </div>
                    <span className="text-xs text-primary">View</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Solar Tech Ltd', 'AgriCorp', 'Dr. Amara Johnson'].map((name, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <p className="font-medium">{name}</p>
                  </div>
                  <span className="text-xs text-primary">Review</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

