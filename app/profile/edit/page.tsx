'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Loader2,
  ArrowLeft,
  Plus,
  X,
  Edit2,
  Trash2,
  Briefcase,
  Building2,
  User,
  MapPin,
  FileText,
} from 'lucide-react';
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
import { businessesApi, UpdateBusinessDto } from '@/lib/api/businesses';
import { STATES, CATEGORIES } from '@/lib/constants';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const TITLE_OPTIONS = ['Dr', 'Mr', 'Mrs', 'Miss', 'Ms'];
const SUFFIX_OPTIONS = ['Jr', 'Sr', 'II', 'III', 'IV', 'V'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const MILITARY_BRANCHES = [
  'Army',
  'Navy',
  'Air Force',
  'Marine Corps',
  'Coast Guard',
  'Space Force',
];

interface FormData {
  // User fields
  name: string;
  title: string;
  category: 'Business' | 'Organization';
  bio: string;
  skills: string[];
  services: Array<{
    id?: string;
    name: string;
    description?: string;
    image?: string;
    price?: string;
  }>;
  website: string;
  linkedin: string;
  twitter: string;
  image: string;
  banner: string;

  // Business Profile
  businessName: string;
  category2: string;
  position: string;
  websiteUrl: string;
  phone: string;
  secondaryPhone: string;
  fax: string;
  description: string;
  veteranOwnedBusiness: boolean;
  branchOfService: string;
  branches: string[];
  referredBy: string;
  other: string;

  // Contact Person
  contactTitle: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  gender: string;

  // Office Address
  officeAddressLine1: string;
  officeAddressLine2: string;
  officeCity: string;
  officeState: string;
  officeZipCode: string;
  officeCounty: string;
  officeCountry: string;

  // Billing Address
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;
  sameAsOffice: boolean;
}

export default function EditProfilePage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [businessData, setBusinessData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      skills: [],
      services: [],
      branches: [],
      veteranOwnedBusiness: false,
      sameAsOffice: false,
    },
  });

  const skills = watch('skills') || [];
  const services = watch('services') || [];
  const branches = watch('branches') || [];
  const veteranOwned = watch('veteranOwnedBusiness');
  const sameAsOffice = watch('sameAsOffice');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/profile/edit');
      return;
    }

    if (user) {
      // Fetch full business data
      businessesApi
        .getById(user.id)
        .then((data) => {
          setBusinessData(data);

          // User fields
          setValue('name', data.businessName || '');
          setValue('title', data.title || '');
          setValue('category', data.category || 'Business');
          setValue('bio', data.description || '');
          setValue('skills', data.skills || []);
          // Convert services to proper format (filter out strings, keep only objects)
          const servicesArray = (data.services || [])
            .map((s) => (typeof s === 'string' ? { name: s } : s))
            .filter(
              (
                s
              ): s is {
                id?: string;
                name: string;
                description?: string;
                image?: string;
                price?: string;
              } => !!s.name
            );
          setValue('services', servicesArray);
          setValue('website', data.websiteUrl || '');
          setValue('linkedin', data.linkedin || '');
          setValue('twitter', data.twitter || '');
          setValue('image', data.image || '');
          setValue('banner', data.banner || '');

          // Business Profile
          setValue('businessName', data.businessName || '');
          setValue('category2', data.category2 || '');
          setValue('position', data.contactPerson?.position || '');
          setValue('websiteUrl', data.websiteUrl || '');
          setValue('phone', data.phone || '');
          setValue('secondaryPhone', data.secondaryPhone || '');
          setValue('fax', data.fax || '');
          setValue('description', data.description || '');
          setValue('veteranOwnedBusiness', data.veteranOwnedBusiness || false);
          setValue('branchOfService', data.branchOfService || '');
          setValue('branches', data.branches || []);
          setValue('referredBy', data.referredBy || '');
          setValue('other', data.other || '');

          // Contact Person
          if (data.contactPerson) {
            setValue('contactTitle', data.contactPerson.title || '');
            setValue('firstName', data.contactPerson.firstName || '');
            setValue('middleName', data.contactPerson.middleName || '');
            setValue('lastName', data.contactPerson.lastName || '');
            setValue('suffix', data.contactPerson.suffix || '');
            setValue('gender', data.contactPerson.gender || '');
          }

          // Office Address
          if (data.officeAddress) {
            setValue('officeAddressLine1', data.officeAddress.addressLine1 || '');
            setValue('officeAddressLine2', data.officeAddress.addressLine2 || '');
            setValue('officeCity', data.officeAddress.city || '');
            setValue('officeState', data.officeAddress.state || '');
            setValue('officeZipCode', data.officeAddress.zipCode || '');
            setValue('officeCounty', data.officeAddress.county || '');
            setValue('officeCountry', data.officeAddress.country || 'UNITED STATES');
          }

          // Billing Address
          if (data.billingAddress) {
            setValue('billingAddressLine1', data.billingAddress.addressLine1 || '');
            setValue('billingAddressLine2', data.billingAddress.addressLine2 || '');
            setValue('billingCity', data.billingAddress.city || '');
            setValue('billingState', data.billingAddress.state || '');
            setValue('billingZipCode', data.billingAddress.zipCode || '');
            setValue('billingCountry', data.billingAddress.country || 'UNITED STATES');
          }

          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching business data:', error);
          toast.error('Failed to load profile data');
          setIsLoading(false);
        });
    }
  }, [user, authLoading, router, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateBusinessDto = {
        // User fields
        name: data.name,
        title: data.title,
        category: data.category,
        bio: data.bio,
        skills: data.skills,
        services: data.services,
        website: data.website,
        linkedin: data.linkedin,
        twitter: data.twitter,
        image: data.image,
        banner: data.banner,

        // Business Profile
        businessProfile: {
          businessName: data.businessName,
          category2: data.category2,
          position: data.position,
          websiteUrl: data.websiteUrl,
          phone: data.phone,
          secondaryPhone: data.secondaryPhone,
          fax: data.fax,
          description: data.description,
          veteranOwnedBusiness: data.veteranOwnedBusiness,
          branchOfService: data.branchOfService,
          branches: data.branches,
          referredBy: data.referredBy,
          other: data.other,
        },

        // Contact Person
        contactPerson: {
          title: data.contactTitle,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          suffix: data.suffix,
          gender: data.gender,
        },

        // Office Address
        officeAddress: {
          addressLine1: data.officeAddressLine1,
          addressLine2: data.officeAddressLine2,
          city: data.officeCity,
          state: data.officeState,
          zipCode: data.officeZipCode,
          county: data.officeCounty,
          country: data.officeCountry || 'UNITED STATES',
        },

        // Billing Address
        billingAddress: data.sameAsOffice
          ? {
              addressLine1: data.officeAddressLine1,
              addressLine2: data.officeAddressLine2,
              city: data.officeCity,
              state: data.officeState,
              zipCode: data.officeZipCode,
              country: data.officeCountry || 'UNITED STATES',
            }
          : {
              addressLine1: data.billingAddressLine1,
              addressLine2: data.billingAddressLine2,
              city: data.billingCity,
              state: data.billingState,
              zipCode: data.billingZipCode,
              country: data.billingCountry || 'UNITED STATES',
            },
      };

      await businessesApi.update(user.id, updateData);
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

  // Skills management
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
      skills.filter((s) => s !== skill)
    );
  };

  // Branches management
  const toggleBranch = (branch: string) => {
    if (branches.includes(branch)) {
      setValue(
        'branches',
        branches.filter((b) => b !== branch)
      );
    } else {
      setValue('branches', [...branches, branch]);
    }
  };

  // Services management
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
      services.filter((_, i) => i !== index)
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
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Business Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Update your business information and make your profile stand out
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Business</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Address</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Additional</span>
              </TabsTrigger>
            </TabsList>

            {/* Business Information Tab */}
            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Basic information about your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        {...register('businessName')}
                        disabled={isSubmitting}
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        onValueChange={(value) => setValue('category', value as any)}
                        value={watch('category') || 'Business'}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Organization">Organization</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category2">Business Category</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('category2', value === '_none' ? '' : value)
                        }
                        value={watch('category2') || '_none'}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">Select business category</SelectItem>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Business Title/Tagline</Label>
                      <Input
                        id="title"
                        {...register('title')}
                        disabled={isSubmitting}
                        placeholder="A short tagline for your business"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      disabled={isSubmitting}
                      placeholder="Tell us about your business, what you offer, and what makes you unique..."
                      rows={5}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        disabled={isSubmitting}
                        placeholder="(XXX) XXX-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                      <Input
                        id="secondaryPhone"
                        {...register('secondaryPhone')}
                        disabled={isSubmitting}
                        placeholder="(XXX) XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fax">Fax Number</Label>
                      <Input
                        id="fax"
                        {...register('fax')}
                        disabled={isSubmitting}
                        placeholder="(XXX) XXX-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        {...register('websiteUrl')}
                        disabled={isSubmitting}
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>

                  {/* Veteran Information */}
                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold">Veteran Information</h3>
                    <div className="mb-4 flex items-center space-x-2">
                      <Checkbox
                        id="veteranOwnedBusiness"
                        checked={veteranOwned}
                        onCheckedChange={(checked) => setValue('veteranOwnedBusiness', !!checked)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="veteranOwnedBusiness" className="cursor-pointer">
                        This is a veteran-owned business
                      </Label>
                    </div>

                    {veteranOwned && (
                      <div className="ml-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="branchOfService">Branch of Service</Label>
                          <Select
                            onValueChange={(value) =>
                              setValue('branchOfService', value === '_none' ? '' : value)
                            }
                            value={watch('branchOfService') || '_none'}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">Select branch</SelectItem>
                              {MILITARY_BRANCHES.map((branch) => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Additional Branches (if applicable)</Label>
                          <div className="flex flex-wrap gap-2">
                            {MILITARY_BRANCHES.map((branch) => (
                              <Button
                                key={branch}
                                type="button"
                                variant={branches.includes(branch) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleBranch(branch)}
                                disabled={isSubmitting}
                              >
                                {branch}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Person Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Person</CardTitle>
                  <CardDescription>Primary contact person for your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactTitle">Title</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('contactTitle', value === '_none' ? '' : value)
                        }
                        value={watch('contactTitle') || '_none'}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">Select Title</SelectItem>
                          {TITLE_OPTIONS.map((title) => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        disabled={isSubmitting}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        {...register('middleName')}
                        disabled={isSubmitting}
                        placeholder="Middle Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        disabled={isSubmitting}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="suffix">Suffix</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('suffix', value === '_none' ? '' : value)
                        }
                        value={watch('suffix') || '_none'}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Suffix" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">None</SelectItem>
                          {SUFFIX_OPTIONS.map((suffix) => (
                            <SelectItem key={suffix} value={suffix}>
                              {suffix}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('gender', value === '_none' ? '' : value)
                        }
                        value={watch('gender') || '_none'}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">Select gender</SelectItem>
                          {GENDER_OPTIONS.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position/Title</Label>
                      <Input
                        id="position"
                        {...register('position')}
                        disabled={isSubmitting}
                        placeholder="CEO, Manager, etc."
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold">Social Media Links</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input
                          id="linkedin"
                          type="url"
                          {...register('linkedin')}
                          disabled={isSubmitting}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter/X URL</Label>
                        <Input
                          id="twitter"
                          type="url"
                          {...register('twitter')}
                          disabled={isSubmitting}
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Office Address</CardTitle>
                    <CardDescription>Your business office location</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="officeAddressLine1">Address Line 1 *</Label>
                      <Input
                        id="officeAddressLine1"
                        {...register('officeAddressLine1')}
                        disabled={isSubmitting}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officeAddressLine2">Address Line 2</Label>
                      <Input
                        id="officeAddressLine2"
                        {...register('officeAddressLine2')}
                        disabled={isSubmitting}
                        placeholder="Suite, unit, building, etc."
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="officeCity">City *</Label>
                        <Input
                          id="officeCity"
                          {...register('officeCity')}
                          disabled={isSubmitting}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="officeState">State *</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue('officeState', value === '_none' ? '' : value)
                          }
                          value={watch('officeState') || '_none'}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">Select state</SelectItem>
                            {STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="officeZipCode">ZIP Code *</Label>
                        <Input
                          id="officeZipCode"
                          {...register('officeZipCode')}
                          disabled={isSubmitting}
                          placeholder="XXXXX"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="officeCounty">County</Label>
                        <Input
                          id="officeCounty"
                          {...register('officeCounty')}
                          disabled={isSubmitting}
                          placeholder="County"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="officeCountry">Country</Label>
                        <Input
                          id="officeCountry"
                          {...register('officeCountry')}
                          disabled={isSubmitting}
                          defaultValue="UNITED STATES"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Billing Address</CardTitle>
                        <CardDescription>Address for billing purposes</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sameAsOffice"
                          checked={sameAsOffice}
                          onCheckedChange={(checked) => setValue('sameAsOffice', !!checked)}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="sameAsOffice" className="cursor-pointer text-sm">
                          Same as office address
                        </Label>
                      </div>
                    </div>
                  </CardHeader>
                  {!sameAsOffice && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingAddressLine1">Address Line 1</Label>
                        <Input
                          id="billingAddressLine1"
                          {...register('billingAddressLine1')}
                          disabled={isSubmitting}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingAddressLine2">Address Line 2</Label>
                        <Input
                          id="billingAddressLine2"
                          {...register('billingAddressLine2')}
                          disabled={isSubmitting}
                          placeholder="Suite, unit, building, etc."
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="billingCity">City</Label>
                          <Input
                            id="billingCity"
                            {...register('billingCity')}
                            disabled={isSubmitting}
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingState">State</Label>
                          <Select
                            onValueChange={(value) =>
                              setValue('billingState', value === '_none' ? '' : value)
                            }
                            value={watch('billingState') || '_none'}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">Select state</SelectItem>
                              {STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingZipCode">ZIP Code</Label>
                          <Input
                            id="billingZipCode"
                            {...register('billingZipCode')}
                            disabled={isSubmitting}
                            placeholder="XXXXX"
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Services & Skills</CardTitle>
                      <CardDescription>Services you offer and skills you have</CardDescription>
                    </div>
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
                              onChange={(e) =>
                                setServiceForm({ ...serviceForm, name: e.target.value })
                              }
                              placeholder="e.g., Web Development"
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
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="service-price">Price</Label>
                            <Input
                              id="service-price"
                              value={serviceForm.price}
                              onChange={(e) =>
                                setServiceForm({ ...serviceForm, price: e.target.value })
                              }
                              placeholder="e.g., $99/hour or Contact for quote"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button type="button" onClick={saveService} className="flex-1">
                              {editingServiceIndex !== null ? 'Update' : 'Add'} Service
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {services.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {services.map((service, index) => (
                        <Card key={service.id || index} className="relative">
                          <CardContent className="p-4">
                            <h4 className="mb-1 font-semibold">{service.name}</h4>
                            {service.description && (
                              <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                                {service.description}
                              </p>
                            )}
                            {service.price && (
                              <p className="mb-3 text-sm font-medium text-primary">
                                {service.price}
                              </p>
                            )}
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openServiceDialog(index)}
                                  >
                                    <Edit2 className="mr-1 h-3 w-3" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                              </Dialog>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeService(index)}
                              >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold">Skills</h3>
                    <div className="mb-4 flex gap-2">
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
                      <Button
                        type="button"
                        onClick={addSkill}
                        disabled={isSubmitting || skills.length >= 10}
                      >
                        Add
                      </Button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Additional Info Tab */}
            <TabsContent value="additional">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Profile images and referral information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="image">Profile Image URL</Label>
                      <Input
                        id="image"
                        type="url"
                        {...register('image')}
                        disabled={isSubmitting}
                        placeholder="https://example.com/profile-image.jpg"
                      />
                      {watch('image') && (
                        <div className="mt-2 h-24 w-24 overflow-hidden rounded-lg border">
                          <img
                            src={watch('image')}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
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
                      {watch('banner') && (
                        <div className="mt-2 overflow-hidden rounded-lg border">
                          <img
                            src={watch('banner')}
                            alt="Banner preview"
                            className="h-24 w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold">Referral Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="referredBy">How did you hear about us?</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue('referredBy', value === '_none' ? '' : value)
                          }
                          value={watch('referredBy') || '_none'}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">Select option</SelectItem>
                            <SelectItem value="Google">Google Search</SelectItem>
                            <SelectItem value="Social Media">Social Media</SelectItem>
                            <SelectItem value="Friend/Family">Friend/Family</SelectItem>
                            <SelectItem value="Chamber Event">Chamber Event</SelectItem>
                            <SelectItem value="Business Partner">Business Partner</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="other">If Other, please specify</Label>
                        <Input
                          id="other"
                          {...register('other')}
                          disabled={isSubmitting}
                          placeholder="Please specify..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Read-only info section */}
                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold">Account Information</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      The following information cannot be edited from this page.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Email Address</Label>
                        <p className="text-sm font-medium">{businessData?.email || user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Verification Status</Label>
                        <p className="text-sm font-medium">
                          {businessData?.verified ? (
                            <span className="text-green-600">✓ Verified</span>
                          ) : (
                            <span className="text-yellow-600">Pending Verification</span>
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Subscription</Label>
                        <p className="text-sm font-medium">
                          {businessData?.subscription?.planName || 'No active subscription'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Member Since</Label>
                        <p className="text-sm font-medium">
                          {businessData?.createdAt
                            ? new Date(businessData.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="sticky bottom-4 mt-8 flex gap-4 rounded-lg border bg-background p-4 shadow-lg">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save All Changes
            </Button>
            <Button type="button" variant="outline" asChild disabled={isSubmitting}>
              <Link href="/dashboard">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
