import { Metadata } from 'next';
import { MessagesPage } from '@/features/messages/components/messages-page';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Your conversations',
};

export default function Messages() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <MessagesPage />
      </main>
      <Footer />
    </>
  );
}
