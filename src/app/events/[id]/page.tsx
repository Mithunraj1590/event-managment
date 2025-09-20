'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    email: string;
  };
  attendees: Array<{
    user: {
      _id: string;
      name: string;
      avatar: string;
    };
    joinedAt: string;
  }>;
  requirements: string[];
  tags: string[];
  isPublic: boolean;
  isFull: boolean;
  hasPassed: boolean;
  isAttending: boolean;
  isOrganizer: boolean;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [eventId, setEventId] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (token) {
          apiClient.setToken(token);
        }
        const resolvedParams = await params;
        setEventId(resolvedParams.id);
        const response = await apiClient.getEvent(resolvedParams.id);
        setEvent(response as Event);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params, token]);

  const handleJoinEvent = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setActionLoading(true);
    try {
      await apiClient.joinEvent(eventId);
      // Refresh event data
      const response = await apiClient.getEvent(eventId);
      setEvent(response as Event);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    setActionLoading(true);
    try {
      await apiClient.leaveEvent(eventId);
      // Refresh event data
      const response = await apiClient.getEvent(eventId);
      setEvent(response as Event);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error || 'Event not found'}</p>
            <Link href="/events">
              <Button className="mt-4">Back to Events</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="mt-2">
                      by {event.organizer.name}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {event.image && (
                  <div className="mb-6">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Date & Time</h4>
                    <p className="text-gray-600">
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Location</h4>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Attendees</h4>
                    <p className="text-gray-600">
                      {event.currentAttendees} / {event.maxAttendees}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Price</h4>
                    <p className="text-gray-600">
                      {event.price > 0 ? `$${event.price}` : 'Free'}
                    </p>
                  </div>
                </div>

                {event.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendees */}
            <Card>
              <CardHeader>
                <CardTitle>Attendees ({event.currentAttendees})</CardTitle>
              </CardHeader>
              <CardContent>
                {event.attendees.length === 0 ? (
                  <p className="text-gray-600">No attendees yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.user._id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={attendee.user.avatar} />
                          <AvatarFallback>
                            {attendee.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{attendee.user.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(attendee.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {event.hasPassed ? (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Event Ended
                    </Badge>
                  ) : event.isFull ? (
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Event Full
                    </Badge>
                  ) : event.isAttending ? (
                    <Badge variant="default" className="text-lg px-4 py-2">
                      You're Attending
                    </Badge>
                  ) : null}

                  {!event.hasPassed && !event.isFull && user && !event.isAttending && !event.isOrganizer && (
                    <Button
                      onClick={handleJoinEvent}
                      disabled={actionLoading}
                      className="w-full"
                      size="lg"
                    >
                      {actionLoading ? 'Joining...' : 'Join Event'}
                    </Button>
                  )}

                  {!event.hasPassed && event.isAttending && !event.isOrganizer && (
                    <Button
                      onClick={handleLeaveEvent}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      {actionLoading ? 'Leaving...' : 'Leave Event'}
                    </Button>
                  )}

                  {!user && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Sign in to join this event</p>
                      <Link href="/auth/login">
                        <Button className="w-full" size="lg">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}

                  {event.isOrganizer && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">You're the organizer</p>
                      <Link href={`/events/${event._id}/edit`}>
                        <Button variant="outline" className="w-full">
                          Edit Event
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizer */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={event.organizer.avatar} />
                    <AvatarFallback>
                      {event.organizer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.organizer.name}</p>
                    <p className="text-sm text-gray-600">{event.organizer.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
