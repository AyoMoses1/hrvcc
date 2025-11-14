import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JobsPage } from '@/features/jobs/components/jobs-page';

export default function Jobs() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <JobsPage />
      </main>
      <Footer />
    </>
  );
}

