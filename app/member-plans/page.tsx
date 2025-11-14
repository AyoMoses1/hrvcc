import { Metadata } from 'next';
import { MemberPlansPage } from '@/features/member-plans/components/member-plans-page';

export const metadata: Metadata = {
  title: 'Member Plans',
  description: 'View and manage HRVCC member plans and pricing',
};

export default function MemberPlans() {
  return <MemberPlansPage />;
}
