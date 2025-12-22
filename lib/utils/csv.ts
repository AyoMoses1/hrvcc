import { User, MemberPlan, Event } from '@/lib/types';
import { getUserDisplayName } from './user';

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data: Record<string, any>[], headers: string[]): string {
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(headers.map((h) => `"${h}"`).join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header] ?? '';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export member directory to CSV
 */
export function exportMemberDirectoryCSV(users: User[]): void {
  const headers = [
    'Category',
    'Business name',
    'Last name',
    'First name',
    'Address',
    'City',
    'State',
    'Zip',
    'Phone',
    'Fax',
    'Texting Number',
    'Texting Keyword',
    'URL',
    'Email',
  ];

  const csvData = users.map((user) => ({
    Category: user.businessCategory || user.businessProfile?.services?.[0] || '',
    'Business name': user.businessProfile?.businessName || getUserDisplayName(user),
    'Last name': user.lastName || '',
    'First name': user.firstName || '',
    Address: user.address || '',
    City: user.city || user.location || '',
    State: user.state || '',
    Zip: user.zip || '',
    Phone: user.businessProfile?.phone || '',
    Fax: user.businessProfile?.fax || '',
    'Texting Number': user.textingNumber || '',
    'Texting Keyword': user.textingKeyword || '',
    URL: user.url || user.businessProfile?.websiteUrl || user.businessProfile?.website || '',
    Email: user.email || '',
  }));

  const csv = arrayToCSV(csvData, headers);
  downloadCSV(csv, `hrvcc-member-directory-${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Export member plans to CSV
 */
export function exportMemberPlansCSV(plans: MemberPlan[]): void {
  const headers = [
    'Category',
    'Plan Name',
    'Monthly Price',
    'Yearly Price',
    'One-Time Price',
    'Features',
  ];

  const csvData = plans.map((plan) => ({
    Category: plan.category,
    'Plan Name': plan.name,
    'Monthly Price': plan.pricing.monthly ? `$${plan.pricing.monthly}` : '',
    'Yearly Price': plan.pricing.yearly ? `$${plan.pricing.yearly}` : '',
    'One-Time Price': plan.pricing.oneTime ? `$${plan.pricing.oneTime}` : '',
    Features: plan.features.join('; '),
  }));

  const csv = arrayToCSV(csvData, headers);
  downloadCSV(csv, `hrvcc-member-plans-${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Parse CSV file to array of objects
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split('\n').filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}
