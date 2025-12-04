'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileText, Calendar, TrendingUp, Users, Building2 } from 'lucide-react';
import { exportMemberDirectoryCSV } from '@/lib/utils/csv';
import { useUsers } from '@/hooks/use-users';
import { useMemo } from 'react';

export function ReportsPage() {
  const [reportType, setReportType] = useState('member-directory');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: usersData } = useUsers({ page: 1, limit: 100 });
  const allUsers = usersData?.data || [];

  const businessUsers = useMemo(() => {
    return allUsers.filter((user) => user.category === 'Business');
  }, [allUsers]);

  const handleGenerateReport = () => {
    if (reportType === 'member-directory') {
      exportMemberDirectoryCSV(businessUsers);
    }
    // Add other report types here
  };

  const reportTypes = [
    {
      id: 'member-directory',
      name: 'Member Directory',
      description: 'Export all business members with full details',
      icon: Building2,
    },
    {
      id: 'membership-plans',
      name: 'Membership Plans',
      description: 'Export membership plans and pricing',
      icon: FileText,
    },
    {
      id: 'events',
      name: 'Events Report',
      description: 'Export events calendar and attendance',
      icon: Calendar,
    },
    {
      id: 'analytics',
      name: 'Analytics Report',
      description: 'Platform usage and engagement metrics',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and export reports for HRVCC member directory
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Selection */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
              <CardDescription>Select report type and configure options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleGenerateReport} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Generate & Download Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Types Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      reportType === type.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
