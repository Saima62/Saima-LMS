import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Saima Perveen English Academy',
    template: '%s — Saima Perveen English Academy'
  },
  description:
    'Learn to speak English with confidence, not just correctness. Spoken English, conversational English, grammar and workplace English courses taught by Saima Perveen.',
  openGraph: {
    title: 'Saima Perveen English Academy',
    description: 'Learn to speak English with confidence, not just correctness.',
    type: 'website',
    siteName: 'Saima Perveen English Academy'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
