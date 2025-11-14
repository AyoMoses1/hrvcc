'use client';

import { useState } from 'react';
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
import { Search, Download, MapPin, Building2, CheckCircle, XCircle } from 'lucide-react';
import { mockUsers } from '@/lib/data/mock-data';
import { exportMemberDirectoryCSV } from '@/lib/utils/csv';
import Link from 'next/link';

export function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter to only show businesses
  const businessUsers = mockUsers.filter((user) => user.category === 'Business');

  const filteredBusinesses = businessUsers.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      business.services?.some((s) => s === selectedCategory) ||
      business.skills?.some((s) => s === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(
      businessUsers.flatMap((b) => [...(b.services || []), ...(b.skills || [])]).filter(Boolean)
    )
  );

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Businesses</h1>
          <p className="text-muted-foreground">
            Manage and view all HRVCC member businesses ({filteredBusinesses.length} total)
          </p>
        </div>
        <Button variant="outline" onClick={() => exportMemberDirectoryCSV(filteredBusinesses)}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search businesses by name or description..."
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

      {/* Businesses Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBusinesses.map((business, index) => (
          <Card
            key={business.id}
            className="card-hover animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                {business.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="mb-1 text-lg font-semibold">{business.name}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{business.title}</p>

              {business.location && (
                <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{business.location}</span>
                </div>
              )}

              {business.services && business.services.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {business.services.slice(0, 2).map((service, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {business.services.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{business.services.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/profile/${business.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No businesses found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
