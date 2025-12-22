'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle2, XCircle, Ban, Unlock, Mail, Phone, Globe, MapPin, Building2 } from 'lucide-react';
import { useBusiness } from '@/hooks/use-businesses';
import { useVerifyBusiness, useSuspendBusiness } from '@/hooks/use-businesses';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

interface AdminUserDetailsModalProps {
  businessId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete?: () => void;
}

export function AdminUserDetailsModal({
  businessId,
  open,
  onOpenChange,
  onActionComplete,
}: AdminUserDetailsModalProps) {
  const { data: business, isLoading, error } = useBusiness(businessId || null);
  const verifyMutation = useVerifyBusiness();
  const suspendMutation = useSuspendBusiness();

  const handleVerify = async () => {
    if (!business) return;
    
    // Toggle verification status: if currently approved, revoke it; otherwise approve it
    const isCurrentlyVerified = business.kycStatus === 'approved';
    const newVerifiedStatus = !isCurrentlyVerified;
    verifyMutation.mutate(
      { id: business.id, verified: newVerifiedStatus },
      {
        onSuccess: () => {
          onActionComplete?.();
        },
      }
    );
  };

  const handleSuspend = async () => {
    if (!business) return;
    
    const newSuspendedStatus = !business.suspended;
    suspendMutation.mutate(
      { id: business.id, suspended: newSuspendedStatus },
      {
        onSuccess: () => {
          onActionComplete?.();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading business details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !business) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {error ? 'Failed to load business details' : 'Business not found'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const isVerified = business.kycStatus === 'approved' || business.verified;
  const isPending = business.kycStatus === 'pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{business.businessName || business.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  {business.category}
                  {business.suspended && (
                    <Badge variant="destructive" className="ml-2">
                      Suspended
                    </Badge>
                  )}
                  {isVerified && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {isPending && (
                    <Badge variant="secondary" className="bg-yellow-500">
                      Pending Verification
                    </Badge>
                  )}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Business Name</p>
                <p className="font-medium">{business.businessName || business.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{business.category}</p>
              </div>
              {business.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{business.email}</p>
                  </div>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{business.phone}</p>
                  </div>
                </div>
              )}
              {business.websiteUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Website</p>
                    <a
                      href={business.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {business.websiteUrl}
                    </a>
                  </div>
                </div>
              )}
              {business.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{business.location}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">KYC Status</p>
                <p className="font-medium capitalize">{business.kycStatus || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatRelativeTime(business.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {business.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{business.description}</p>
            </div>
          )}

          {/* Contact Person */}
          {business.contactPerson && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Contact Person</h3>
              <p className="text-sm">
                {business.contactPerson.fullName}
                {business.contactPerson.position && ` - ${business.contactPerson.position}`}
              </p>
            </div>
          )}

          {/* Address */}
          {business.officeAddress && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Office Address</h3>
              <p className="text-sm text-muted-foreground">{business.officeAddress.fullAddress}</p>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant={business.suspended ? 'default' : 'destructive'}
              onClick={handleSuspend}
              disabled={suspendMutation.isPending}
              className="flex-1 sm:flex-initial"
            >
              {suspendMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : business.suspended ? (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Unsuspend
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </>
              )}
            </Button>
            <Button
              variant={isVerified ? 'outline' : 'default'}
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="flex-1 sm:flex-initial"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isVerified ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Revoke Verification
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

