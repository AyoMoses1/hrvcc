'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Briefcase, AlertCircle, TrendingUp, Loader2, Ban } from 'lucide-react';
import { adminApi, AdminStats } from '@/lib/api/admin';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AdminUserDetailsModal } from './admin-user-details-modal';

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getStats();
        console.log('Admin stats received:', data);
        console.log('Suspended users:', data.suspendedUsers);
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load statistics');
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleBusinessClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBusinessId(null);
  };

  const handleActionComplete = () => {
    // Refetch stats after an action is completed
    adminApi.getStats().then(setStats).catch(console.error);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error || 'Failed to load statistics'}</p>
            <Button className="mt-4" onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: '+' + stats.newUsersThisMonth,
    },
    {
      label: 'Organizations',
      value: stats.totalOrganizations.toLocaleString(),
      icon: Building2,
    },
    {
      label: 'Businesses',
      value: stats.totalBusinesses.toLocaleString(),
      icon: Building2,
    },
    {
      label: 'Staff',
      value: (stats.totalStaff || 0).toLocaleString(),
      icon: Users,
    },
    {
      label: 'Active Jobs',
      value: stats.totalJobs.toLocaleString(),
      icon: Briefcase,
    },
    {
      label: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: TrendingUp,
    },
    {
      label: 'Suspended Users',
      value: (stats.suspendedUsers?.length || 0).toLocaleString(),
      icon: Ban,
    },
    {
      label: 'Revenue',
      value: '$' + (stats.revenue || 0).toLocaleString(),
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
        {statCards.map((stat) => {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentRegistrations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent registrations</p>
              ) : (
                stats.recentRegistrations.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name || user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(user.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBusinessClick(user.id)}
                      className="text-xs text-primary"
                    >
                      View
                    </Button>
                  </div>
                ))
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
              {stats.pendingVerifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending verifications</p>
              ) : (
                stats.pendingVerifications.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <p className="font-medium">{user.name || user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBusinessClick(user.id)}
                      className="text-xs text-primary"
                    >
                      Review
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Suspended Users
              </CardTitle>
              {stats.suspendedUsers && stats.suspendedUsers.length > 0 && (
                <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                  {stats.suspendedUsers.length}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!stats.suspendedUsers || stats.suspendedUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No suspended users</p>
              ) : (
                stats.suspendedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="font-medium">{user.name || user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.category} • {formatRelativeTime(user.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBusinessClick(user.id)}
                      className="text-xs text-primary"
                    >
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin User Details Modal */}
      <AdminUserDetailsModal
        businessId={selectedBusinessId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onActionComplete={handleActionComplete}
      />
    </div>
  );
}
