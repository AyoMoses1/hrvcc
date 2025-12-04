'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileInput } from '@/lib/validations/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Plus, X, Edit2, Trash2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { usersApi } from '@/lib/api/users';
import { USER_CATEGORIES, STATES } from '@/lib/constants';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function EditProfilePage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      skills: [],
      services: [],
    },
  });

  const skills = watch('skills') || [];
  const services = watch('services') || [];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/profile/edit');
      return;
    }

    if (user) {
      // Fetch full user data
      usersApi
        .getById(user.id)
        .then((data) => {
          setUserData(data);
          setValue('name', data.name || '');
          setValue('title', data.title || '');
          setValue('category', (data.category as any) || 'Professional');
          setValue('location', data.location || '');
          setValue('country', (data.country as any) || 'Texas');
          setValue('bio', data.bio || '');
          setValue('skills', data.skills || []);
          const servicesData = data.services || [];
          const normalizedServices = servicesData.map((s: any, index: number) => {
            if (typeof s === 'string') {
              return { id: crypto.randomUUID(), name: s };
            }
            return { id: s.id || crypto.randomUUID(), ...s };
          });
          setValue('services', normalizedServices);
          setValue('website', data.website || '');
          setValue('linkedin', data.linkedin || '');
          setValue('twitter', data.twitter || '');
          setValue('image', data.image || '');
          setValue('banner', data.banner || '');
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load profile data');
          setIsLoading(false);
        });
    }
  }, [user, authLoading, router, setValue]);

  const onSubmit = async (data: ProfileInput) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await usersApi.update(user.id, data);
      await refreshUser();
      toast.success('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    const input = document.getElementById('skill-input') as HTMLInputElement;
    const value = input?.value.trim();
    if (value && !skills.includes(value) && skills.length < 10) {
      setValue('skills', [...skills, value]);
      input.value = '';
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      'skills',
      skills.filter((s) => s !== skill),
    );
  };

  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
  });

  const openServiceDialog = (index?: number) => {
    if (index !== undefined) {
      const service = services[index];
      setServiceForm({
        name: service.name || '',
        description: service.description || '',
        image: service.image || '',
        price: service.price || '',
      });
      setEditingServiceIndex(index);
    } else {
      setServiceForm({ name: '', description: '', image: '', price: '' });
      setEditingServiceIndex(null);
    }
  };

  const saveService = () => {
    if (!serviceForm.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    const newService = {
      id: editingServiceIndex !== null ? services[editingServiceIndex].id : crypto.randomUUID(),
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim() || undefined,
      image: serviceForm.image.trim() || undefined,
      price: serviceForm.price.trim() || undefined,
    };

    if (editingServiceIndex !== null) {
      const updated = [...services];
      updated[editingServiceIndex] = newService;
      setValue('services', updated);
    } else {
      if (services.length >= 10) {
        toast.error('Maximum 10 services allowed');
        return;
      }
      setValue('services', [...services, newService]);
    }

    setServiceForm({ name: '', description: '', image: '', price: '' });
    setEditingServiceIndex(null);
  };

  const removeService = (index: number) => {
    setValue(
      'services',
      services.filter((_, i) => i !== index),
    );
  };

  if (authLoading || isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information and make it stand out</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  disabled={isSubmitting}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title/Position *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  disabled={isSubmitting}
                  placeholder="Senior Software Engineer"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  onValueChange={(value) => setValue('category', value as any)}
                  defaultValue={userData?.category || 'Professional'}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register('location')}
                  disabled={isSubmitting}
                  placeholder="Houston, TX"
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country/State *</Label>
                <Select
                  onValueChange={(value) => setValue('country', value as any)}
                  defaultValue={userData?.country || 'Texas'}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  disabled={isSubmitting}
                  placeholder="Tell us about yourself, your experience, and what you offer..."
                  rows={5}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum 50 characters, maximum 500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (Max 10)</Label>
                <div className="flex gap-2">
                  <Input
                    id="skill-input"
                    placeholder="Add a skill"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <Button type="button" onClick={addSkill} disabled={isSubmitting || skills.length >= 10}>
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-destructive"
                          disabled={isSubmitting}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.skills && (
                  <p className="text-sm text-destructive">{errors.skills.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Services (Max 10)</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openServiceDialog()}
                        disabled={isSubmitting || services.length >= 10}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingServiceIndex !== null ? 'Edit Service' : 'Add New Service'}
                        </DialogTitle>
                        <DialogDescription>
                          Add details about the service you offer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="service-name">Service Name *</Label>
                          <Input
                            id="service-name"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                            placeholder="e.g., Web Development"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="service-description">Description</Label>
                          <Textarea
                            id="service-description"
                            value={serviceForm.description}
                            onChange={(e) =>
                              setServiceForm({ ...serviceForm, description: e.target.value })
                            }
                            placeholder="Describe what this service includes..."
                            rows={4}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="service-image">Image URL</Label>
                          <Input
                            id="service-image"
                            type="url"
                            value={serviceForm.image}
                            onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                            placeholder="https://example.com/service-image.jpg"
                            disabled={isSubmitting}
                          />
                          {serviceForm.image && (
                            <div className="mt-2 rounded-lg overflow-hidden border">
                              <img
                                src={serviceForm.image}
                                alt="Service preview"
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="service-price">Price</Label>
                          <Input
                            id="service-price"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                            placeholder="e.g., $99/hour or Contact for quote"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="button" onClick={saveService} disabled={isSubmitting} className="flex-1">
                            {editingServiceIndex !== null ? 'Update' : 'Add'} Service
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setServiceForm({ name: '', description: '', image: '', price: '' });
                              setEditingServiceIndex(null);
                            }}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {services.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {services.map((service, index) => (
                      <Card key={service.id || index} className="relative">
                        <CardContent className="p-4">
                          {service.image ? (
                            <div className="mb-3 h-32 w-full rounded-lg overflow-hidden">
                              <img
                                src={service.image}
                                alt={service.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="mb-3 h-32 w-full rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <Briefcase className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <h4 className="font-semibold mb-1">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {service.description}
                            </p>
                          )}
                          {service.price && (
                            <p className="text-sm font-medium text-primary mb-3">{service.price}</p>
                          )}
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openServiceDialog(index)}
                                  disabled={isSubmitting}
                                >
                                  <Edit2 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Service</DialogTitle>
                                  <DialogDescription>Update service details</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-service-name">Service Name *</Label>
                                    <Input
                                      id="edit-service-name"
                                      value={serviceForm.name}
                                      onChange={(e) =>
                                        setServiceForm({ ...serviceForm, name: e.target.value })
                                      }
                                      disabled={isSubmitting}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-service-description">Description</Label>
                                    <Textarea
                                      id="edit-service-description"
                                      value={serviceForm.description}
                                      onChange={(e) =>
                                        setServiceForm({ ...serviceForm, description: e.target.value })
                                      }
                                      rows={4}
                                      disabled={isSubmitting}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-service-image">Image URL</Label>
                                    <Input
                                      id="edit-service-image"
                                      type="url"
                                      value={serviceForm.image}
                                      onChange={(e) =>
                                        setServiceForm({ ...serviceForm, image: e.target.value })
                                      }
                                      disabled={isSubmitting}
                                    />
                                    {serviceForm.image && (
                                      <div className="mt-2 rounded-lg overflow-hidden border">
                                        <img
                                          src={serviceForm.image}
                                          alt="Service preview"
                                          className="w-full h-32 object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-service-price">Price</Label>
                                    <Input
                                      id="edit-service-price"
                                      value={serviceForm.price}
                                      onChange={(e) =>
                                        setServiceForm({ ...serviceForm, price: e.target.value })
                                      }
                                      disabled={isSubmitting}
                                    />
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      type="button"
                                      onClick={saveService}
                                      disabled={isSubmitting}
                                      className="flex-1"
                                    >
                                      Update Service
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        setServiceForm({ name: '', description: '', image: '', price: '' });
                                        setEditingServiceIndex(null);
                                      }}
                                      disabled={isSubmitting}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeService(index)}
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {errors.services && (
                  <p className="text-sm text-destructive">{errors.services.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('website')}
                  disabled={isSubmitting}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  {...register('linkedin')}
                  disabled={isSubmitting}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {errors.linkedin && (
                  <p className="text-sm text-destructive">{errors.linkedin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  type="url"
                  {...register('twitter')}
                  disabled={isSubmitting}
                  placeholder="https://twitter.com/yourhandle"
                />
                {errors.twitter && (
                  <p className="text-sm text-destructive">{errors.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  {...register('image')}
                  disabled={isSubmitting}
                  placeholder="https://example.com/profile-image.jpg"
                />
                {errors.image && (
                  <p className="text-sm text-destructive">{errors.image.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter a URL to your profile image
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner">Banner Image URL</Label>
                <Input
                  id="banner"
                  type="url"
                  {...register('banner')}
                  disabled={isSubmitting}
                  placeholder="https://example.com/banner-image.jpg"
                />
                {errors.banner && (
                  <p className="text-sm text-destructive">{errors.banner.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter a URL to your banner image (recommended: 1920x400px)
                </p>
                {watch('banner') && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img
                      src={watch('banner')}
                      alt="Banner preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button type="button" variant="outline" asChild disabled={isSubmitting}>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}

