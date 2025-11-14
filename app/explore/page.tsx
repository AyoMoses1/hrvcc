import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ExplorePage } from '@/features/explore/components/explore-page';

export default function Explore() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ExplorePage />
      </main>
      <Footer />
    </>
  );
}

