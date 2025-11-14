import { Metadata } from 'next';
import { CategoriesPage } from '@/features/admin/components/categories-page';

export const metadata: Metadata = {
  title: 'Manage Categories',
  description: 'Manage business categories for the HRVCC member directory',
};

export default function Categories() {
  return <CategoriesPage />;
}
