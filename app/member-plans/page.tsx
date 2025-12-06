import { Metadata } from 'next';
import { MemberPlansPage } from '@/features/member-plans/components/member-plans-page';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Member Plans',
  description: 'View and manage HRVCC member plans and pricing',
};

export default function MemberPlans() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <MemberPlansPage />
      </main>
      <Footer />
    </>
  );
}
