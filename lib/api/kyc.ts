import { apiClient } from './axios';

// Types
export interface KycStatus {
  currentStep: string;
  status: string;
  completedSteps: string[];
  nextStep: string | null;
  isComplete: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface BusinessInfoDto {
  businessName: string;
  category2?: string;
  position?: string;
  phone?: string;
  secondaryPhone?: string;
  fax?: string;
  websiteUrl?: string;
  description?: string;
}

export interface ContactPersonDto {
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender?: string;
}

export interface OfficeAddressDto {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  country?: string;
}

export interface VeteranInfoDto {
  veteranOwnedBusiness: boolean;
  branchOfService?: string;
  branches?: string[];
  referredBy?: string;
  other?: string;
}

export interface BillingInfoDto {
  firstName?: string;
  lastName?: string;
  company?: string;
  billingEmail?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  sameAsOfficeAddress?: boolean;
}

export interface KycData {
  status: KycStatus;
  data: {
    businessInfo: BusinessInfoDto | null;
    contactPerson: ContactPersonDto | null;
    officeAddress: OfficeAddressDto | null;
    veteranInfo: VeteranInfoDto | null;
    documents: Array<{
      id: string;
      name: string;
      fileUrl: string;
      fileType: string;
      documentType: string;
      createdAt: string;
    }>;
    billingInfo: BillingInfoDto | null;
    billingAddress: OfficeAddressDto | null;
  };
}

export const kycApi = {
  /**
   * Get current KYC status
   */
  getStatus: async (): Promise<KycStatus> => {
    const { data } = await apiClient.get<KycStatus>('/kyc/status');
    return data;
  },

  /**
   * Get all KYC data
   */
  getData: async (): Promise<KycData> => {
    const { data } = await apiClient.get<KycData>('/kyc/data');
    return data;
  },

  /**
   * Stage 2: Save business information
   */
  saveBusinessInfo: async (dto: BusinessInfoDto): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/business-info', dto);
    return data;
  },

  /**
   * Stage 3: Save contact person
   */
  saveContactPerson: async (dto: ContactPersonDto): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/contact-person', dto);
    return data;
  },

  /**
   * Stage 4: Save office address
   */
  saveOfficeAddress: async (dto: OfficeAddressDto): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/office-address', dto);
    return data;
  },

  /**
   * Stage 5: Save veteran information
   */
  saveVeteranInfo: async (dto: VeteranInfoDto): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/veteran-info', dto);
    return data;
  },

  /**
   * Stage 6: Upload documents
   */
  uploadDocuments: async (files: File[]): Promise<KycStatus & { uploadedDocuments?: any[] }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    const { data } = await apiClient.post('/kyc/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Stage 6: Confirm documents (without uploading new ones)
   */
  confirmDocuments: async (): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/documents');
    return data;
  },

  /**
   * Stage 7: Save billing information
   */
  saveBillingInfo: async (dto: BillingInfoDto): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/billing-info', dto);
    return data;
  },

  /**
   * Submit KYC for review
   */
  submit: async (): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/submit');
    return data;
  },

  /**
   * Skip optional steps and complete KYC
   */
  skipAndComplete: async (): Promise<KycStatus> => {
    const { data } = await apiClient.post<KycStatus>('/kyc/skip-and-complete');
    return data;
  },
};

// KYC Step constants
export const KYC_STEPS = {
  REGISTERED: 'registered',
  BUSINESS_INFO: 'business_info',
  CONTACT_PERSON: 'contact_person',
  OFFICE_ADDRESS: 'office_address',
  VETERAN_INFO: 'veteran_info',
  DOCUMENTS: 'documents',
  BILLING_INFO: 'billing_info',
  COMPLETED: 'completed',
} as const;

export const KYC_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Step order for navigation
export const KYC_STEP_ORDER = [
  KYC_STEPS.REGISTERED,
  KYC_STEPS.BUSINESS_INFO,
  KYC_STEPS.CONTACT_PERSON,
  KYC_STEPS.OFFICE_ADDRESS,
  KYC_STEPS.VETERAN_INFO,
  KYC_STEPS.DOCUMENTS,
  KYC_STEPS.BILLING_INFO,
  KYC_STEPS.COMPLETED,
];

export const KYC_STEP_LABELS: Record<string, string> = {
  [KYC_STEPS.REGISTERED]: 'Account Created',
  [KYC_STEPS.BUSINESS_INFO]: 'Business Information',
  [KYC_STEPS.CONTACT_PERSON]: 'Contact Person',
  [KYC_STEPS.OFFICE_ADDRESS]: 'Office Address',
  [KYC_STEPS.VETERAN_INFO]: 'Veteran Information',
  [KYC_STEPS.DOCUMENTS]: 'Documents',
  [KYC_STEPS.BILLING_INFO]: 'Billing Information',
  [KYC_STEPS.COMPLETED]: 'Completed',
};
