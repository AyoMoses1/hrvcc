import { Metadata } from 'next';
import { ContactPage } from '@/features/contact/components/contact-page';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with HRVCC - Houston Regional Veterans Chamber of Commerce',
};

export default function Contact() {
  return <ContactPage />;
}

