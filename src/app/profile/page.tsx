'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isEmailVerified: boolean;
  joinedEvents: Array<{
    _id: string;
    title: string;
    date: string;
    location: string;
  }>;
  createdEvents: Array<{
    _id: string;
    title: string;
    date: string;
    location: string;
    currentAttendees: number;
    maxAttendees: number;
  }>;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    avatar: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        if (token) {
          apiClient.setToken(token);
        }
        const response = await apiClient.getUserProfile();
        setProfile(response as UserProfile);
        setFormData({
          name: (response as UserProfile).name,
          avatar: (response as UserProfile).avatar
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.updateUserProfile(formData);
      setProfile(response as UserProfile);
      updateUser({
        id: (response as UserProfile)._id,
        name: (response as UserProfile).name,
        email: (response as UserProfile).email,
        avatar: (response as UserProfile).avatar,
        role: (response as UserProfile).role,
        isEmailVerified: (response as UserProfile).isEmailVerified
      });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
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
          {/* Profile Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback className="text-lg">
                        {formData.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      type="url"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={profile?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={profile?.role || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email Verification</Label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${profile?.isEmailVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">
                        {profile?.isEmailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? 'Saving...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Profile Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile?.createdEvents.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Events Created</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {profile?.joinedEvents.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Events Joined</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatDate(profile?.createdAt || '')}
                    </div>
                    <div className="text-sm text-gray-600">Member Since</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Created Events */}
            <Card>
              <CardHeader>
                <CardTitle>Created Events</CardTitle>
                <CardDescription>Events you've organized</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.createdEvents.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    You haven't created any events yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {profile?.createdEvents.map((event) => (
                      <div key={event._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.date)} • {event.location}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.currentAttendees}/{event.maxAttendees} attendees
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Joined Events */}
            <Card>
              <CardHeader>
                <CardTitle>Joined Events</CardTitle>
                <CardDescription>Events you're attending</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.joinedEvents.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    You haven't joined any events yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {profile?.joinedEvents.map((event) => (
                      <div key={event._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.date)} • {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
