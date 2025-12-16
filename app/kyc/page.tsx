'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';
import {
  Loader2,
  CheckCircle,
  Circle,
  Building2,
  User,
  MapPin,
  Shield,
  FileText,
  CreditCard,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { kycApi, KycStatus, KYC_STEPS, KYC_STEP_LABELS, KYC_STEP_ORDER } from '@/lib/api/kyc';
import { STATES, CATEGORIES } from '@/lib/constants';

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

// Step icons
const STEP_ICONS: Record<string, React.ReactNode> = {
  [KYC_STEPS.REGISTERED]: <CheckCircle className="h-5 w-5" />,
  [KYC_STEPS.BUSINESS_INFO]: <Building2 className="h-5 w-5" />,
  [KYC_STEPS.CONTACT_PERSON]: <User className="h-5 w-5" />,
  [KYC_STEPS.OFFICE_ADDRESS]: <MapPin className="h-5 w-5" />,
  [KYC_STEPS.VETERAN_INFO]: <Shield className="h-5 w-5" />,
  [KYC_STEPS.DOCUMENTS]: <FileText className="h-5 w-5" />,
  [KYC_STEPS.BILLING_INFO]: <CreditCard className="h-5 w-5" />,
  [KYC_STEPS.COMPLETED]: <CheckCircle className="h-5 w-5" />,
};

export default function KycPage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);
  const [activeStep, setActiveStep] = useState<string>(KYC_STEPS.BUSINESS_INFO);

  // Form data for each step
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    category2: '',
    position: '',
    phone: '',
    secondaryPhone: '',
    fax: '',
    websiteUrl: '',
    description: '',
  });

  const [contactPerson, setContactPerson] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    gender: '',
  });

  const [officeAddress, setOfficeAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    county: '',
    country: 'UNITED STATES',
  });

  const [veteranInfo, setVeteranInfo] = useState({
    veteranOwnedBusiness: false,
    branchOfService: '',
    branches: [] as string[],
    referredBy: '',
    other: '',
  });

  const [documents, setDocuments] = useState<File[]>([]);

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    billingEmail: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UNITED STATES',
    sameAsOfficeAddress: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/kyc');
      return;
    }

    if (user) {
      loadKycData();
    }
  }, [user, authLoading, router]);

  const loadKycData = async () => {
    try {
      const data = await kycApi.getData();
      setKycStatus(data.status);

      // Pre-fill form data
      if (data.data.businessInfo) {
        setBusinessInfo({
          businessName: data.data.businessInfo.businessName || '',
          category2: data.data.businessInfo.category2 || '',
          position: data.data.businessInfo.position || '',
          phone: data.data.businessInfo.phone || '',
          secondaryPhone: data.data.businessInfo.secondaryPhone || '',
          fax: data.data.businessInfo.fax || '',
          websiteUrl: data.data.businessInfo.websiteUrl || '',
          description: data.data.businessInfo.description || '',
        });
      }

      if (data.data.contactPerson) {
        setContactPerson({
          title: data.data.contactPerson.title || '',
          firstName: data.data.contactPerson.firstName || '',
          middleName: data.data.contactPerson.middleName || '',
          lastName: data.data.contactPerson.lastName || '',
          suffix: data.data.contactPerson.suffix || '',
          gender: data.data.contactPerson.gender || '',
        });
      }

      if (data.data.officeAddress) {
        setOfficeAddress({
          addressLine1: data.data.officeAddress.addressLine1 || '',
          addressLine2: data.data.officeAddress.addressLine2 || '',
          city: data.data.officeAddress.city || '',
          state: data.data.officeAddress.state || '',
          zipCode: data.data.officeAddress.zipCode || '',
          county: data.data.officeAddress.county || '',
          country: data.data.officeAddress.country || 'UNITED STATES',
        });
      }

      if (data.data.veteranInfo) {
        setVeteranInfo({
          veteranOwnedBusiness: data.data.veteranInfo.veteranOwnedBusiness || false,
          branchOfService: data.data.veteranInfo.branchOfService || '',
          branches: data.data.veteranInfo.branches || [],
          referredBy: data.data.veteranInfo.referredBy || '',
          other: data.data.veteranInfo.other || '',
        });
      }

      if (data.data.billingInfo) {
        setBillingInfo({
          firstName: data.data.billingInfo.firstName || '',
          lastName: data.data.billingInfo.lastName || '',
          company: data.data.billingInfo.company || '',
          billingEmail: data.data.billingInfo.billingEmail || '',
          addressLine1: data.data.billingInfo.addressLine1 || '',
          city: data.data.billingInfo.city || '',
          state: data.data.billingInfo.state || '',
          zipCode: data.data.billingInfo.zipCode || '',
          country: data.data.billingInfo.country || 'UNITED STATES',
          sameAsOfficeAddress: false,
        });
      }

      // Set active step based on current progress
      if (data.status.currentStep === KYC_STEPS.COMPLETED) {
        setActiveStep(KYC_STEPS.COMPLETED);
      } else if (data.status.nextStep) {
        setActiveStep(data.status.nextStep);
      } else {
        setActiveStep(KYC_STEPS.BUSINESS_INFO);
      }
    } catch (error) {
      console.error('Failed to load KYC data:', error);
      toast.error('Failed to load your KYC progress');
    } finally {
      setIsLoading(false);
    }
  };

  const saveBusinessInfo = async () => {
    if (!businessInfo.businessName) {
      toast.error('Business name is required');
      return;
    }

    setIsSaving(true);
    try {
      const status = await kycApi.saveBusinessInfo(businessInfo);
      setKycStatus(status);
      toast.success('Business information saved');
      setActiveStep(KYC_STEPS.CONTACT_PERSON);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const saveContactPerson = async () => {
    if (!contactPerson.firstName || !contactPerson.lastName) {
      toast.error('First name and last name are required');
      return;
    }

    setIsSaving(true);
    try {
      const status = await kycApi.saveContactPerson(contactPerson);
      setKycStatus(status);
      toast.success('Contact person saved');
      setActiveStep(KYC_STEPS.OFFICE_ADDRESS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const saveOfficeAddress = async () => {
    if (
      !officeAddress.addressLine1 ||
      !officeAddress.city ||
      !officeAddress.state ||
      !officeAddress.zipCode
    ) {
      toast.error('Please fill in all required address fields');
      return;
    }

    setIsSaving(true);
    try {
      const status = await kycApi.saveOfficeAddress(officeAddress);
      setKycStatus(status);
      toast.success('Office address saved');
      setActiveStep(KYC_STEPS.VETERAN_INFO);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const saveVeteranInfo = async () => {
    setIsSaving(true);
    try {
      const status = await kycApi.saveVeteranInfo(veteranInfo);
      setKycStatus(status);
      toast.success('Veteran information saved');
      setActiveStep(KYC_STEPS.DOCUMENTS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const saveDocuments = async () => {
    setIsSaving(true);
    try {
      let status;
      if (documents.length > 0) {
        status = await kycApi.uploadDocuments(documents);
        toast.success(`${documents.length} document(s) uploaded`);
      } else {
        status = await kycApi.confirmDocuments();
        toast.success('Documents step completed');
      }
      setKycStatus(status);
      setDocuments([]);
      setActiveStep(KYC_STEPS.BILLING_INFO);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const saveBillingInfo = async () => {
    setIsSaving(true);
    try {
      const dataToSend = billingInfo.sameAsOfficeAddress
        ? { ...billingInfo, ...officeAddress, sameAsOfficeAddress: true }
        : billingInfo;

      const status = await kycApi.saveBillingInfo(dataToSend);
      setKycStatus(status);
      toast.success('Billing information saved');
      setActiveStep(KYC_STEPS.COMPLETED);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const submitKyc = async () => {
    setIsSaving(true);
    try {
      const status = await kycApi.submit();
      setKycStatus(status);
      await refreshUser();
      toast.success('KYC submitted for review!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setIsSaving(false);
    }
  };

  const skipAndComplete = async () => {
    setIsSaving(true);
    try {
      const status = await kycApi.skipAndComplete();
      setKycStatus(status);
      await refreshUser();
      toast.success('KYC submitted for review!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete');
    } finally {
      setIsSaving(false);
    }
  };

  const getStepIndex = (step: string) => KYC_STEP_ORDER.indexOf(step as any);
  const isStepCompleted = (step: string) => kycStatus?.completedSteps?.includes(step) || false;
  const isStepAccessible = (step: string) => {
    if (step === KYC_STEPS.REGISTERED) return true;
    const stepIndex = getStepIndex(step);
    const currentIndex = getStepIndex(kycStatus?.currentStep || KYC_STEPS.REGISTERED);
    return stepIndex <= currentIndex + 1;
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
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the following steps to finish your business profile verification.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar - Step Progress */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {KYC_STEP_ORDER.filter((step) => step !== KYC_STEPS.REGISTERED).map(
                    (step, index) => {
                      const isCompleted = isStepCompleted(step);
                      const isActive = activeStep === step;
                      const isAccessible = isStepAccessible(step);

                return (
                  <button
                          key={step}
                          onClick={() => isAccessible && setActiveStep(step)}
                          disabled={!isAccessible}
                          className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : isCompleted
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : isAccessible
                                  ? 'hover:bg-muted'
                                  : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isCompleted ? 'bg-green-500 text-white' : 'bg-muted'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                              STEP_ICONS[step] || <Circle className="h-5 w-5" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{KYC_STEP_LABELS[step]}</span>
                        </button>
                      );
                    }
                  )}
                </div>

                {kycStatus &&
                  getStepIndex(kycStatus.currentStep) >= getStepIndex(KYC_STEPS.OFFICE_ADDRESS) && (
                    <div className="mt-6 border-t pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={skipAndComplete}
                        disabled={isSaving}
                      >
                        Skip & Complete Later
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Step Forms */}
          <div className="lg:col-span-3">
            {/* Business Information */}
            {activeStep === KYC_STEPS.BUSINESS_INFO && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Tell us about your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={businessInfo.businessName}
                        onChange={(e) =>
                          setBusinessInfo({ ...businessInfo, businessName: e.target.value })
                        }
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category2">Business Category</Label>
                      <Select
                        value={businessInfo.category2 || '_none'}
                        onValueChange={(v) =>
                          setBusinessInfo({ ...businessInfo, category2: v === '_none' ? '' : v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">Select category</SelectItem>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={businessInfo.phone}
                        onChange={(e) =>
                          setBusinessInfo({ ...businessInfo, phone: e.target.value })
                        }
                        placeholder="(XXX) XXX-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        value={businessInfo.websiteUrl}
                        onChange={(e) =>
                          setBusinessInfo({ ...businessInfo, websiteUrl: e.target.value })
                        }
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      value={businessInfo.description}
                      onChange={(e) =>
                        setBusinessInfo({ ...businessInfo, description: e.target.value })
                      }
                      placeholder="Tell us about your business..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={saveBusinessInfo} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save & Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Person */}
            {activeStep === KYC_STEPS.CONTACT_PERSON && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Person</CardTitle>
                  <CardDescription>Primary contact for your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Select
                        value={contactPerson.title || '_none'}
                        onValueChange={(v) =>
                          setContactPerson({ ...contactPerson, title: v === '_none' ? '' : v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">Select</SelectItem>
                          {TITLE_OPTIONS.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={contactPerson.firstName}
                        onChange={(e) =>
                          setContactPerson({ ...contactPerson, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={contactPerson.middleName}
                        onChange={(e) =>
                          setContactPerson({ ...contactPerson, middleName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={contactPerson.lastName}
                        onChange={(e) =>
                          setContactPerson({ ...contactPerson, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Suffix</Label>
                      <Select
                        value={contactPerson.suffix || '_none'}
                        onValueChange={(v) =>
                          setContactPerson({ ...contactPerson, suffix: v === '_none' ? '' : v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Suffix" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">None</SelectItem>
                          {SUFFIX_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={contactPerson.gender || '_none'}
                        onValueChange={(v) =>
                          setContactPerson({ ...contactPerson, gender: v === '_none' ? '' : v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">Select</SelectItem>
                          {GENDER_OPTIONS.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(KYC_STEPS.BUSINESS_INFO)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={saveContactPerson} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save & Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Office Address */}
            {activeStep === KYC_STEPS.OFFICE_ADDRESS && (
              <Card>
                <CardHeader>
                  <CardTitle>Office Address</CardTitle>
                  <CardDescription>Your business location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={officeAddress.addressLine1}
                      onChange={(e) =>
                        setOfficeAddress({ ...officeAddress, addressLine1: e.target.value })
                      }
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={officeAddress.addressLine2}
                      onChange={(e) =>
                        setOfficeAddress({ ...officeAddress, addressLine2: e.target.value })
                      }
                      placeholder="Suite, unit, etc."
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={officeAddress.city}
                        onChange={(e) =>
                          setOfficeAddress({ ...officeAddress, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State *</Label>
                      <Select
                        value={officeAddress.state || '_none'}
                        onValueChange={(v) =>
                          setOfficeAddress({ ...officeAddress, state: v === '_none' ? '' : v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">Select state</SelectItem>
                          {STATES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={officeAddress.zipCode}
                        onChange={(e) =>
                          setOfficeAddress({ ...officeAddress, zipCode: e.target.value })
                        }
                        placeholder="XXXXX"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(KYC_STEPS.CONTACT_PERSON)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={saveOfficeAddress} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save & Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Veteran Information */}
            {activeStep === KYC_STEPS.VETERAN_INFO && (
              <Card>
                <CardHeader>
                  <CardTitle>Veteran Information</CardTitle>
                  <CardDescription>Optional - Tell us about your military service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="veteranOwned"
                      checked={veteranInfo.veteranOwnedBusiness}
                      onCheckedChange={(checked) =>
                        setVeteranInfo({ ...veteranInfo, veteranOwnedBusiness: !!checked })
                      }
                    />
                    <Label htmlFor="veteranOwned" className="cursor-pointer">
                      This is a veteran-owned business
                    </Label>
                  </div>

                  {veteranInfo.veteranOwnedBusiness && (
                    <div className="ml-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Branch of Service</Label>
                        <Select
                          value={veteranInfo.branchOfService || '_none'}
                          onValueChange={(v) =>
                            setVeteranInfo({
                              ...veteranInfo,
                              branchOfService: v === '_none' ? '' : v,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">Select branch</SelectItem>
                            {MILITARY_BRANCHES.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>How did you hear about us?</Label>
                    <Select
                      value={veteranInfo.referredBy || '_none'}
                      onValueChange={(v) =>
                        setVeteranInfo({ ...veteranInfo, referredBy: v === '_none' ? '' : v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Select</SelectItem>
                        <SelectItem value="Google">Google Search</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Friend/Family">Friend/Family</SelectItem>
                        <SelectItem value="Chamber Event">Chamber Event</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(KYC_STEPS.OFFICE_ADDRESS)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={saveVeteranInfo} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save & Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {activeStep === KYC_STEPS.DOCUMENTS && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Upload your business documents (optional)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border-2 border-dashed p-8 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setDocuments(Array.from(e.target.files || []))}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, DOC, JPG up to 10MB each</p>
                    </label>
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected files:</Label>
                      <ul className="space-y-1">
                        {documents.map((file, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setActiveStep(KYC_STEPS.VETERAN_INFO)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={saveDocuments} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {documents.length > 0 ? 'Upload & Continue' : 'Skip & Continue'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Information */}
            {activeStep === KYC_STEPS.BILLING_INFO && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Optional - Add billing details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsOffice"
                      checked={billingInfo.sameAsOfficeAddress}
                      onCheckedChange={(checked) =>
                        setBillingInfo({ ...billingInfo, sameAsOfficeAddress: !!checked })
                      }
                    />
                    <Label htmlFor="sameAsOffice" className="cursor-pointer">
                      Same as office address
                    </Label>
                  </div>

                  {!billingInfo.sameAsOfficeAddress && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="billingFirstName">First Name</Label>
                          <Input
                            id="billingFirstName"
                            value={billingInfo.firstName}
                            onChange={(e) =>
                              setBillingInfo({ ...billingInfo, firstName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingLastName">Last Name</Label>
                          <Input
                            id="billingLastName"
                            value={billingInfo.lastName}
                            onChange={(e) =>
                              setBillingInfo({ ...billingInfo, lastName: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingEmail">Billing Email</Label>
                        <Input
                          id="billingEmail"
                          type="email"
                          value={billingInfo.billingEmail}
                          onChange={(e) =>
                            setBillingInfo({ ...billingInfo, billingEmail: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setActiveStep(KYC_STEPS.DOCUMENTS)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={saveBillingInfo} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save & Complete
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
            </div>
          </CardContent>
        </Card>
            )}

            {/* Completed */}
            {activeStep === KYC_STEPS.COMPLETED && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Profile Complete!
            </CardTitle>
                  <CardDescription>Your business profile is ready for review</CardDescription>
          </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Thank you for completing your profile. Our team will review your information and
                    verify your business. You'll be notified once the review is complete.
                  </p>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={submitKyc} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Submit for Review
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
        </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
