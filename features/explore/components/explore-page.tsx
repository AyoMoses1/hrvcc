'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useBusinesses } from '@/hooks/use-businesses';
import { useDebounce } from '@/hooks/use-debounce';
import { categories } from '@/lib/data/mock-data';

export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: businessesData,
    isLoading,
    error,
  } = useBusinesses({
    page: 1,
    limit: 100,
    // Only show businesses with completed KYC (verified = true means kycStatus = 'approved')
    verified: true,
  });
  const allBusinesses = businessesData?.data || [];

  const filteredBusinesses = useMemo(() => {
    // Start with verified businesses (already filtered by API)
    // Also filter out suspended businesses on the frontend as an extra safeguard
    let filtered = allBusinesses.filter((business) => !business.suspended);

    if (debouncedSearch) {
      filtered = filtered.filter(
        (business) =>
          business.businessName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          business.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          business.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          business.skills?.some((s) => s.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
          business.services?.some((s) => {
            const serviceName = typeof s === 'string' ? s : s.name;
            return serviceName.toLowerCase().includes(debouncedSearch.toLowerCase());
          })
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (business) =>
          business.skills?.includes(selectedCategory) ||
          business.services?.some((s) => {
            const serviceName = typeof s === 'string' ? s : s.name;
            return serviceName === selectedCategory;
          })
      );
    }

    return filtered;
  }, [allBusinesses, debouncedSearch, selectedCategory]);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Member Directory</h1>
          <p className="text-muted-foreground">Discover businesses in the HRVCC community</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, or skills..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
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
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading businesses...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-destructive">Failed to load businesses. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredBusinesses.length} results
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBusinesses.map((business, index) => (
              <Card
                key={business.id}
                className="card-hover animate-fade-in flex flex-col overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {business.businessName.charAt(0)}
                    </div>
                    {business.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-1 font-semibold">{business.businessName}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {business.title}
                  </p>

                  <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{business.location || business.officeAddress?.city}</span>
                    </div>
                    {business.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{business.rating}</span>
                      </div>
                    )}
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {business.category}
                  </Badge>

                  {/* Spacer to push footer to bottom */}
                  <div className="mt-auto"></div>
                </CardContent>

                <CardFooter className="mt-auto border-t bg-muted/50 p-4">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href={`/profile/${business.slug || business.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredBusinesses.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-lg text-muted-foreground">
                  No results found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
