import { Metadata } from 'next';
import { ContactPage } from '@/features/contact/components/contact-page';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with HRVCC - Houston Regional Veterans Chamber of Commerce',
};

export default function Contact() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ContactPage />
      </main>
      <Footer />
    </>
  );
}
