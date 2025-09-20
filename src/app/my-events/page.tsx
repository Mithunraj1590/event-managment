'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  image: string;
  organizer: {
    _id: string;
    name: string;
    avatar: string;
  };
  isFull: boolean;
  hasPassed: boolean;
  isAttending: boolean;
  isOrganizer: boolean;
}

export default function MyEventsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'created' | 'joined'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        if (token) {
          apiClient.setToken(token);
        }
        const response = await apiClient.getUserEvents(activeTab);
        setEvents(response as Event[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, token, router, activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'created': return 'Created Events';
      case 'joined': return 'Joined Events';
      default: return 'All My Events';
    }
  };

  const getFilteredEvents = () => {
    if (activeTab === 'all') return events;
    return events.filter(event => {
      if (activeTab === 'created') return event.isOrganizer;
      if (activeTab === 'joined') return event.isAttending && !event.isOrganizer;
      return true;
    });
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Events</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {(['all', 'created', 'joined'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading events: {error}</p>
          </div>
        ) : getFilteredEvents().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {activeTab === 'created' && "You haven't created any events yet."}
              {activeTab === 'joined' && "You haven't joined any events yet."}
              {activeTab === 'all' && "You don't have any events yet."}
            </p>
            <Link href="/events/create">
              <Button>Create Your First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredEvents().map((event) => (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="mt-1">
                        by {event.organizer.name}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="secondary">{event.category}</Badge>
                      {event.isOrganizer && (
                        <Badge variant="default">Organizer</Badge>
                      )}
                      {event.isAttending && !event.isOrganizer && (
                        <Badge variant="outline">Attending</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📅 {formatDate(event.date)} at {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.currentAttendees}/{event.maxAttendees} attendees</p>
                    {event.price > 0 && <p>💰 ${event.price}</p>}
                  </div>
                  <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      {event.isFull && <Badge variant="destructive">Full</Badge>}
                      {event.hasPassed && <Badge variant="secondary">Past</Badge>}
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/events/${event._id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                      {event.isOrganizer && (
                        <Link href={`/events/${event._id}/edit`}>
                          <Button size="sm" variant="outline">Edit</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
