'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Download,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldX,
  Eye,
  FileText,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { exportMemberDirectoryCSV } from '@/lib/utils/csv';
import Link from 'next/link';
import { useBusinesses, useVerifyBusiness, useSuspendBusiness } from '@/hooks/use-businesses';
import { useDebounce } from '@/hooks/use-debounce';

export function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Business' | 'Organization'>(
    'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: businessesData,
    isLoading,
    error,
  } = useBusinesses({
    page: 1,
    limit: 100,
    category: selectedCategory,
    verified: selectedStatus === 'all' ? undefined : selectedStatus === 'verified',
    search: debouncedSearch || undefined,
  });

  const businesses = businessesData?.data || [];
  const verifyMutation = useVerifyBusiness();
  const suspendMutation = useSuspendBusiness();

  const handleVerify = (id: string, verified: boolean) => {
    verifyMutation.mutate({ id, verified });
  };

  const handleSuspend = (id: string, suspended: boolean) => {
    suspendMutation.mutate({ id, suspended });
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Businesses</h1>
          <p className="text-muted-foreground">
            Manage and verify HRVCC member businesses ({businesses.length} total)
          </p>
        </div>
        <Button variant="outline" onClick={() => exportMemberDirectoryCSV(businesses as any)}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by business name, contact, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Organization">Organization</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Pending Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading businesses...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading businesses. Please try again later.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Business</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Contact Person</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Documents</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr key={business.id} className="border-b hover:bg-muted/25">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{business.businessName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {business.email}
                            </div>
                            {business.phone && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {business.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {business.contactPerson ? (
                          <div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {business.contactPerson.title} {business.contactPerson.fullName}
                              </span>
                            </div>
                            {business.contactPerson.position && (
                              <p className="text-xs text-muted-foreground">
                                {business.contactPerson.position}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline">{business.category}</Badge>
                        {business.veteranOwnedBusiness && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            Veteran
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {business.officeAddress ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {business.officeAddress.city}, {business.officeAddress.state}
                            </span>
                          </div>
                        ) : business.location ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{business.location}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {business.verified ? (
                            <Badge className="w-fit bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="w-fit bg-yellow-100 text-yellow-800">
                              <XCircle className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                          {business.suspended && (
                            <Badge variant="destructive" className="w-fit">
                              Suspended
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {business.documents && business.documents.length > 0 ? (
                          <Badge variant="outline">
                            <FileText className="mr-1 h-3 w-3" />
                            {business.documents.length} file(s)
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {new Date(business.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/profile/${business.slug || business.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {business.verified ? (
                              <DropdownMenuItem
                                onClick={() => handleVerify(business.id, false)}
                                disabled={verifyMutation.isPending}
                              >
                                <ShieldX className="mr-2 h-4 w-4" />
                                Revoke Verification
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleVerify(business.id, true)}
                                disabled={verifyMutation.isPending}
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Verify Business
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {business.suspended ? (
                              <DropdownMenuItem
                                onClick={() => handleSuspend(business.id, false)}
                                disabled={suspendMutation.isPending}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Unsuspend Business
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleSuspend(business.id, true)}
                                disabled={suspendMutation.isPending}
                                className="text-destructive"
                              >
                                <ShieldX className="mr-2 h-4 w-4" />
                                Suspend Business
                              </DropdownMenuItem>
                            )}
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

      {!isLoading && businesses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No businesses found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
