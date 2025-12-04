'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { Event } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  useEvents,
  useCreateEvent,
} from '@/hooks/use-events';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export function EventsPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    location: '',
    category: '',
  });

  const debouncedSearch = useDebounce(searchQuery, 300);
  const createEventMutation = useCreateEvent();

  const eventCategories = ['Networking', 'Workshop', 'Conference', 'Social', 'Other'];

  const filters = useMemo(() => {
    const filterParams: any = {
      page: 1,
      limit: 100,
    };

    if (selectedCategory !== 'all') {
      filterParams.category = selectedCategory;
    }

    if (debouncedSearch) {
      filterParams.search = debouncedSearch;
    }

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      filterParams.from = dateStr;
      filterParams.to = dateStr;
    } else {
      filterParams.upcomingOnly = true;
    }

    return filterParams;
  }, [selectedCategory, debouncedSearch, selectedDate]);

  const { data: eventsData, isLoading, error } = useEvents(filters);
  const events = eventsData?.data || [];

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date) {
      return;
    }

    try {
      await createEventMutation.mutateAsync({
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date.toISOString().split('T')[0],
        startTime: newEvent.startTime || undefined,
        endTime: newEvent.endTime || undefined,
        location: newEvent.location || undefined,
        category: newEvent.category || undefined,
      });

      setNewEvent({
        title: '',
        description: '',
        date: new Date(),
        startTime: '',
        endTime: '',
        location: '',
        category: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const eventsByDate = useMemo(() => {
    return events.reduce(
      (acc, event) => {
        const dateKey = event.date.toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      },
      {} as Record<string, Event[]>
    );
  }, [events]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Events Calendar</h1>
          <p className="text-muted-foreground">View and manage HRVCC events</p>
        </div>
        {user?.role === 'admin' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Event
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date.toISOString().split('T')[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newEvent.category}
                    onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter event location"
                />
              </div>
              <Button
                onClick={handleAddEvent}
                className="w-full"
                disabled={createEventMutation.isPending}
              >
                {createEventMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Event'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search events..."
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
              {eventCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold">Calendar</CardTitle>
              <p className="text-xs text-muted-foreground">
                {selectedDate
                  ? `Viewing events for ${formatDate(selectedDate)}`
                  : 'Click a date to filter events'}
              </p>
            </CardHeader>
            <CardContent className="overflow-visible px-4 pb-4">
              <div className="w-full">
                <Calendar
                  selected={selectedDate || null}
                  onSelect={(date) => setSelectedDate(date || undefined)}
                  defaultMonth={new Date('2024-12-01')}
                  highlightDates={events.map((e) => {
                    const d = new Date(e.date);
                    d.setHours(0, 0, 0, 0);
                    return d;
                  })}
                  className="w-full"
                />
              </div>
              <div className="mt-6 space-y-2 border-t pt-4">
                <p className="mb-3 text-sm font-semibold">Upcoming Events:</p>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {events
                    .filter((e) => new Date(e.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 6)
                    .map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedDate(new Date(event.date))}
                        className="group flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-accent"
                      >
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary transition-transform group-hover:scale-125" />
                        <span className="flex-1 truncate text-xs font-medium transition-colors group-hover:text-primary">
                          {event.title}
                        </span>
                        <span className="flex-shrink-0 text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </button>
                    ))}
                  {events.filter((e) => new Date(e.date) >= new Date()).length === 0 && (
                    <p className="py-2 text-center text-xs text-muted-foreground">
                      No upcoming events
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading events...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-destructive">Failed to load events. Please try again.</p>
              </CardContent>
            </Card>
          ) : Object.keys(eventsByDate).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No events found for the selected filters.</p>
                {selectedDate && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try selecting a different date or clearing your filters.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(eventsByDate)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([date, dateEvents], dateIndex) => (
                  <div
                    key={date}
                    className="animate-fade-in"
                    style={{ animationDelay: `${dateIndex * 0.1}s` }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-lg font-bold">{new Date(date).getDate()}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{formatDate(new Date(date))}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dateEvents.length} {dateEvents.length === 1 ? 'event' : 'events'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {dateEvents.map((event, eventIndex) => (
                        <Card
                          key={event.id}
                          className="card-hover animate-slide-in border-l-4 border-l-primary"
                          style={{ animationDelay: `${(dateIndex + eventIndex) * 0.1}s` }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="mb-2 text-xl">{event.title}</CardTitle>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              {event.category && (
                                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                  {event.category}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-4 text-sm">
                              {event.startTime && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {event.startTime}
                                    {event.endTime && ` - ${event.endTime}`}
                                  </span>
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span className="max-w-md truncate">{event.location}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
