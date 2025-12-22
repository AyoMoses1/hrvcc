'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Download,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  KeyRound,
} from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { useDebounce } from '@/hooks/use-debounce';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'sonner';

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useUsers({ page: 1, limit: 1000 });
  const allUsers = usersData?.data || [];

  const filteredUsers = useMemo(() => {
    return allUsers
      .map((user) => ({
        ...user,
        // Extract title and location from businessProfile if not directly on user
        title: user.title || user.businessProfile?.title,
        location: user.location || user.businessProfile?.location,
        // Compute kycVerified from kycStatus if not provided
        kycVerified: user.kycVerified ?? user.kycStatus === 'approved',
      }))
      .filter((user) => {
        const displayName =
          user.name ||
          (user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || user.lastName || '');
        const matchesSearch =
          !debouncedSearch ||
          displayName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || user.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
  }, [allUsers, debouncedSearch, selectedCategory]);

  const categories = Array.from(new Set(allUsers.map((u) => u.category).filter(Boolean)));

  const handleResetPassword = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminApi.sendPasswordReset(userId);
      toast.success('Password reset email sent successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send password reset email');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (userId: string, suspended: boolean) => {
    setActionLoading(userId);
    try {
      await adminApi.suspendBusiness(userId, suspended);
      toast.success(suspended ? 'User suspended successfully' : 'User unsuspended successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">
            Manage and view all platform users ({filteredUsers.length} total)
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name, title, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading users...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading users. Please try again later.</p>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No users found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      KYC Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-background">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => {
                        if (!user.suspended) {
                          window.location.href = `/profile/${user.slug || user.id}`;
                        }
                      }}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {(
                              user.name ||
                              (user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.firstName || user.lastName || 'U')
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {user.name ||
                                (user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.firstName || user.lastName || 'User')}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge variant="outline">{user.category}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {user.email || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {user.location ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{user.location}</span>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {user.kycVerified ? (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            KYC Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <XCircle className="mr-1 h-3 w-3" />
                            {user.kycStatus || 'Pending'}
                          </Badge>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleResetPassword(user.id)}
                              disabled={actionLoading === user.id}
                            >
                              <KeyRound className="mr-2 h-4 w-4" />
                              {actionLoading === user.id ? 'Sending...' : 'Reset Password'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSuspend(user.id, !user.suspended)}
                              disabled={actionLoading === user.id}
                              className={user.suspended ? 'text-green-600' : 'text-destructive'}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {actionLoading === user.id
                                ? 'Processing...'
                                : user.suspended
                                  ? 'Unsuspend User'
                                  : 'Suspend User'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
