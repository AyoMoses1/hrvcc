import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  kycApi,
  BusinessInfoDto,
  ContactPersonDto,
  OfficeAddressDto,
  VeteranInfoDto,
  BillingInfoDto,
} from '@/lib/api/kyc';
import { toast } from 'sonner';

export function useKycStatus() {
  return useQuery({
    queryKey: ['kyc', 'status'],
    queryFn: () => kycApi.getStatus(),
    staleTime: 30000,
  });
}

export function useKycData() {
  return useQuery({
    queryKey: ['kyc', 'data'],
    queryFn: () => kycApi.getData(),
    staleTime: 30000,
  });
}

export function useSaveBusinessInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: BusinessInfoDto) => kycApi.saveBusinessInfo(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('Business information saved');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Failed to save business information');
      }
    },
  });
}

export function useSaveContactPerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ContactPersonDto) => kycApi.saveContactPerson(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('Contact person saved');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Failed to save contact person');
      }
    },
  });
}

export function useSaveOfficeAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: OfficeAddressDto) => kycApi.saveOfficeAddress(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('Office address saved');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Failed to save office address');
      }
    },
  });
}

export function useSaveVeteranInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: VeteranInfoDto) => kycApi.saveVeteranInfo(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('Veteran information saved');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Failed to save veteran information');
      }
    },
  });
}

export function useUploadDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => kycApi.uploadDocuments(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('Documents uploaded');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload documents');
    },
  });
}

export function useConfirmDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => kycApi.confirmDocuments(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('Documents step completed');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm documents');
    },
  });
}

export function useSaveBillingInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: BillingInfoDto) => kycApi.saveBillingInfo(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('Billing information saved');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Failed to save billing information');
      }
    },
  });
}

export function useSubmitKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => kycApi.submit(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('KYC submitted for review');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Failed to submit KYC');
      }
    },
  });
}

export function useSkipAndComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => kycApi.skipAndComplete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('KYC submitted for review');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Failed to complete KYC');
      }
    },
  });
}
