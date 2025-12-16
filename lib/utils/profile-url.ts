/**
 * Utility function to generate profile URL
 * Uses slug if available, falls back to ID for backward compatibility
 */
export function getProfileUrl(userOrBusiness: { id: string; slug?: string }): string {
  return `/profile/${userOrBusiness.slug || userOrBusiness.id}`;
}
