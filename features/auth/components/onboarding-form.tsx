'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useMemberPlans } from '@/hooks/use-member-plans';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface OnboardingData {
  // Plan
  planId: string;

  // Business Information
  businessName: string;
  category: string;
  category2: string;

  // Contact Person
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  position: string;

  // Address
  officeAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  phone: string;
  secondaryPhone: string;
  fax: string;
  websiteUrl: string;

  // Personal Details
  gender: string;
  veteranOwnedBusiness: boolean;
  branches: string[];
  branchOfService: string;
  referredBy: string;
  other: string;

  // Documents
  documents: File[];
  profilePhoto: File | null;

  // Email & Password
  email: string;
  billingEmail: string;
  username: string;
  password: string;
  confirmPassword: string;

  // Billing
  billingFirstName: string;
  billingLastName: string;
  billingCompany: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;

  // Payment
  creditCardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvmNumber: string;
}

const STEPS = [
  'Business Information',
  'Contact Person',
  'Address & Contact',
  'Personal Details',
  'Documents',
  'Email & Password',
  'Billing & Payment',
  'Review & Confirm',
];

export function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId') || '';
  const { data: plansData } = useMemberPlans({ page: 1, limit: 100 });
  const selectedPlan = plansData?.data?.find((p) => p.id === planId);
  const { register: registerUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    planId,
    businessName: '',
    category: '',
    category2: '',
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    position: '',
    officeAddress: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    county: '',
    phone: '',
    secondaryPhone: '',
    fax: '',
    websiteUrl: '',
    gender: '',
    veteranOwnedBusiness: false,
    branches: [],
    branchOfService: '',
    referredBy: '',
    other: '',
    documents: [],
    profilePhoto: null,
    email: '',
    billingEmail: '',
    username: '',
    password: '',
    confirmPassword: '',
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'UNITED STATES',
    creditCardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvmNumber: '',
  });

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'documents' | 'profilePhoto', file: File | null) => {
    if (field === 'profilePhoto') {
      updateFormData('profilePhoto', file);
    } else {
      if (file) {
        updateFormData('documents', [...formData.documents, file]);
      }
    }
  };

  const removeDocument = (index: number) => {
    updateFormData(
      'documents',
      formData.documents.filter((_, i) => i !== index)
    );
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

      // Create FormData to send files
      const submitFormData = new FormData();

      // Structure data according to the backend DTOs
      const registrationData = {
        // Core user fields
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        username: formData.username,
        category: formData.category,
        planId: formData.planId || undefined,

        // Business Profile
        businessProfile: {
          businessName: formData.businessName,
          category2: formData.category2 || undefined,
          position: formData.position || undefined,
          websiteUrl: formData.websiteUrl || undefined,
          phone: formData.phone || undefined,
          secondaryPhone: formData.secondaryPhone || undefined,
          fax: formData.fax || undefined,
          veteranOwnedBusiness: formData.veteranOwnedBusiness,
          branchOfService: formData.branchOfService || undefined,
          branches: formData.branches.length > 0 ? formData.branches : undefined,
          referredBy: formData.referredBy || undefined,
          other: formData.other || undefined,
        },

        // Contact Person
        contactPerson: {
          title: formData.title || undefined,
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          suffix: formData.suffix || undefined,
          gender: formData.gender || undefined,
        },

        // Office Address
        officeAddress: {
          addressLine1: formData.officeAddress,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          county: formData.county || undefined,
          country: 'UNITED STATES',
        },

        // Billing Info
        billingInfo: {
          firstName: formData.billingFirstName || undefined,
          lastName: formData.billingLastName || undefined,
          company: formData.billingCompany || undefined,
          billingEmail: formData.billingEmail || undefined,
          addressLine1: formData.billingAddress || undefined,
          city: formData.billingCity || undefined,
          state: formData.billingState || undefined,
          zipCode: formData.billingZip || undefined,
          country: formData.billingCountry || 'UNITED STATES',
          creditCardNumber: formData.creditCardNumber || undefined,
          expirationMonth: formData.expirationMonth || undefined,
          expirationYear: formData.expirationYear || undefined,
          cvmNumber: formData.cvmNumber || undefined,
        },
      };

      // Add form data as JSON string
      submitFormData.append('data', JSON.stringify(registrationData));

      // Add profile photo if exists
      if (formData.profilePhoto) {
        submitFormData.append('files', formData.profilePhoto, 'profilePhoto');
      }

      // Add documents
      formData.documents.forEach((doc) => {
        submitFormData.append('files', doc);
      });

      // Send to backend API
      const response = await fetch(`${API_URL}/auth/register-with-files`, {
        method: 'POST',
        body: submitFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to complete registration');
      }

      const result = await response.json();

      // Store token
      localStorage.setItem('auth_token', result.token);
      document.cookie = `auth_token=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      toast.success('Registration completed successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete registration');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Business Information
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => updateFormData('category', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Select One --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category2">Category 2</Label>
              <Select
                value={formData.category2}
                onValueChange={(v) => updateFormData('category2', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Select One --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1: // Contact Person
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Dr/Mr/Mrs/Miss/Ms</Label>
              <Select value={formData.title} onValueChange={(v) => updateFormData('title', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="-Select Title-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr">Dr</SelectItem>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Miss">Miss</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="firstName">Contact First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => updateFormData('middleName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Contact Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                value={formData.suffix}
                onChange={(e) => updateFormData('suffix', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => updateFormData('position', e.target.value)}
              />
            </div>
          </div>
        );

      case 2: // Address & Contact
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="officeAddress">Office Address (Mapped): *</Label>
              <Input
                id="officeAddress"
                value={formData.officeAddress}
                onChange={(e) => updateFormData('officeAddress', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address line 2</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => updateFormData('addressLine2', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Select value={formData.state} onValueChange={(v) => updateFormData('state', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select One --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Florida">Florida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">ZIP/Postal *</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => updateFormData('zip', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => updateFormData('county', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="secondaryPhone">Secondary Phone</Label>
              <Input
                id="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={(e) => updateFormData('secondaryPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fax">Fax</Label>
              <Input
                id="fax"
                value={formData.fax}
                onChange={(e) => updateFormData('fax', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => updateFormData('websiteUrl', e.target.value)}
              />
            </div>
          </div>
        );

      case 3: // Personal Details
        return (
          <div className="space-y-4">
            <div>
              <Label>Gender *</Label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                  />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                  />
                  Female
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Do Not Disclose"
                    checked={formData.gender === 'Do Not Disclose'}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                  />
                  Do Not Disclose
                </label>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.veteranOwnedBusiness}
                  onChange={(e) => updateFormData('veteranOwnedBusiness', e.target.checked)}
                />
                Veteran Owned Business?
              </label>
            </div>
            {formData.veteranOwnedBusiness && (
              <div>
                <Label htmlFor="branchOfService">Branch of Service? *</Label>
                <Select
                  value={formData.branchOfService}
                  onValueChange={(v) => updateFormData('branchOfService', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select One --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US Air Force">US Air Force</SelectItem>
                    <SelectItem value="US Army">US Army</SelectItem>
                    <SelectItem value="US Coast Guard">US Coast Guard</SelectItem>
                    <SelectItem value="US Marine">US Marine</SelectItem>
                    <SelectItem value="US Navy">US Navy</SelectItem>
                    <SelectItem value="US Space Force">US Space Force</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="referredBy">Referred By</Label>
              <Select
                value={formData.referredBy}
                onValueChange={(v) => updateFormData('referredBy', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Select One --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="other">Other</Label>
              <Input
                id="other"
                value={formData.other}
                onChange={(e) => updateFormData('other', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0] || null)}
              />
              {formData.profilePhoto && (
                <p className="mt-2 text-sm text-muted-foreground">{formData.profilePhoto.name}</p>
              )}
            </div>
          </div>
        );

      case 4: // Documents
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Document Requirements</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Veteran Owned Businesses:</strong> DD-214 or TVC or SBA Business
                  Certification Letter
                </li>
                <li>
                  <strong>Military Spouse Owned Businesses:</strong> DD-214 & Marriage Certificate
                </li>
                <li>
                  <strong>First Responder Owned Businesses:</strong> Upload EMS, Nursing, Doctor,
                  Police, Fire or other First Responder License (First Aid Card or CPR Card not
                  accepted)
                </li>
                <li>
                  <strong>VSO's, Non-profits & Educational Organizations:</strong> Upload 501(c)(3)
                  Letter
                </li>
              </ul>
            </div>
            <div>
              <Label htmlFor="documents">Upload Documents</Label>
              <Input
                id="documents"
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach((file) => handleFileUpload('documents', file));
                }}
              />
            </div>
            {formData.documents.length > 0 && (
              <div className="space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between rounded border p-2">
                    <span className="text-sm">{doc.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              When done, click on the continue button to continue your registration.
            </p>
          </div>
        );

      case 5: // Email & Password
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">Enter a valid email address</p>
            </div>
            <div>
              <Label htmlFor="billingEmail">Billing Email</Label>
              <Input
                id="billingEmail"
                type="email"
                value={formData.billingEmail}
                onChange={(e) => updateFormData('billingEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="username">Choose a Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => updateFormData('username', e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Enter a username you can easily remember
              </p>
            </div>
            <div>
              <Label htmlFor="password">Choose a Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Enter a password (8-20 characters in length)
              </p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Re-enter Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 6: // Billing & Payment
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Payment Summary</h3>
              {selectedPlan && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>
                      $
                      {selectedPlan.pricing.yearly ||
                        selectedPlan.pricing.monthly ||
                        selectedPlan.pricing.oneTime ||
                        0}{' '}
                      USD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Card Surcharge (4%):</span>
                    <span>
                      $
                      {(
                        (selectedPlan.pricing.yearly ||
                          selectedPlan.pricing.monthly ||
                          selectedPlan.pricing.oneTime ||
                          0) * 0.04
                      ).toFixed(2)}{' '}
                      USD
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Amount to be Charged:</span>
                    <span>
                      $
                      {(
                        (selectedPlan.pricing.yearly ||
                          selectedPlan.pricing.monthly ||
                          selectedPlan.pricing.oneTime ||
                          0) * 1.04
                      ).toFixed(2)}{' '}
                      USD
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingFirstName">First Name</Label>
                <Input
                  id="billingFirstName"
                  value={formData.billingFirstName}
                  onChange={(e) => updateFormData('billingFirstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="billingLastName">Last Name</Label>
                <Input
                  id="billingLastName"
                  value={formData.billingLastName}
                  onChange={(e) => updateFormData('billingLastName', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="billingCompany">Company</Label>
              <Input
                id="billingCompany"
                value={formData.billingCompany}
                onChange={(e) => updateFormData('billingCompany', e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              (Please enter your billing address below.)
            </p>
            <div>
              <Label htmlFor="billingAddress">Address</Label>
              <Input
                id="billingAddress"
                value={formData.billingAddress}
                onChange={(e) => updateFormData('billingAddress', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  value={formData.billingCity}
                  onChange={(e) => updateFormData('billingCity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="billingState">State/Province</Label>
                <Select
                  value={formData.billingState}
                  onValueChange={(v) => updateFormData('billingState', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select One --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingZip">ZIP/Postal</Label>
                <Input
                  id="billingZip"
                  value={formData.billingZip}
                  onChange={(e) => updateFormData('billingZip', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="billingCountry">Country</Label>
                <Select
                  value={formData.billingCountry}
                  onValueChange={(v) => updateFormData('billingCountry', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNITED STATES">UNITED STATES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="creditCardNumber">Credit Card Number</Label>
              <Input
                id="creditCardNumber"
                value={formData.creditCardNumber}
                onChange={(e) => updateFormData('creditCardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expirationMonth">Expiration Month</Label>
                <Select
                  value={formData.expirationMonth}
                  onValueChange={(v) => updateFormData('expirationMonth', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expirationYear">Expiration Year</Label>
                <Select
                  value={formData.expirationYear}
                  onValueChange={(v) => updateFormData('expirationYear', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="cvmNumber">CVM Number</Label>
              <Input
                id="cvmNumber"
                value={formData.cvmNumber}
                onChange={(e) => updateFormData('cvmNumber', e.target.value)}
                placeholder="123"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                (3 or 4-digit numeric code that is printed on the back of the credit card)
              </p>
            </div>
          </div>
        );

      case 7: // Review & Confirm
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Member(s) To Be Registered</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </p>
                <p>
                  <strong>Address:</strong> {formData.officeAddress}, {formData.city},{' '}
                  {formData.state} {formData.zip}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                {selectedPlan && (
                  <div className="mt-4">
                    <p className="font-semibold">Membership Plan and Fees:</p>
                    <p>
                      $
                      {selectedPlan.pricing.yearly ||
                        selectedPlan.pricing.monthly ||
                        selectedPlan.pricing.oneTime ||
                        0}
                      : {selectedPlan.name}
                    </p>
                    <p>$50.00: Registration Fee for your HRVCC Member webpage building-out</p>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Billing Option</h3>
              <label className="flex items-center gap-2">
                <input type="radio" name="billing" defaultChecked />
                Pay Online/Credit Card
              </label>
              <p className="mt-2 text-sm text-muted-foreground">
                (A credit card surcharge of 4% will also be charged.)
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please verify the following is correct. Click on "Complete Your Registration" to
              continue.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!planId) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No plan selected. Please select a plan first.</p>
            <Button className="mt-4" asChild>
              <Link href="/member-plans?signup=true">Select Plan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              Welcome aboard to your Houston Regional Veterans Chamber - HRVCC
            </h1>
            {selectedPlan && (
              <p className="mt-2 text-sm text-muted-foreground">
                Plan Selected: {selectedPlan.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <Badge
                  variant={
                    index === currentStep
                      ? 'default'
                      : index < currentStep
                        ? 'secondary'
                        : 'outline'
                  }
                  className="text-xs"
                >
                  {index + 1}
                </Badge>
                {index < STEPS.length - 1 && <div className="mx-2 h-px w-8 bg-border" />}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm font-medium">{STEPS[currentStep]}</p>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <CardContent className="flex justify-between border-t">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Your Registration'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
