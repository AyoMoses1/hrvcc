export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'HRVCC Member Directory';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const USER_CATEGORIES = ['Business', 'Organization', 'Staff'] as const;
export type UserCategory = (typeof USER_CATEGORIES)[number];

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote'] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const USER_STATUS = ['active', 'inactive', 'suspended'] as const;
export type UserStatus = (typeof USER_STATUS)[number];

export const STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
] as const;

// Business categories - from HRVCC member plan categories
// These match the categories from the HRVCC website and Excel file
export const CATEGORIES = [
  'HRVCC Sponsorship Opportunities',
  'Veteran Owned Business',
  'Military Spouse Owned Business',
  'First Responder Owned Business',
  'Passionate Patriot Owned Business',
  'Veteran/MilitarySpouse/1stResponder Individual',
  'Veteran Service Organization',
  'Non-profit Organization with a Veteran Service',
  'Education Institution',
  'Government Organization',
  'Alliance Partner',
  'Donors',
] as const;

// Mutable array for runtime category management
export let businessCategories: string[] = [...CATEGORIES];

export function setBusinessCategories(categories: string[]) {
  businessCategories = categories;
}

export function getBusinessCategories(): string[] {
  return businessCategories;
}

export const ITEMS_PER_PAGE = 12;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
