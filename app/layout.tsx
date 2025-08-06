
import './globals.css';
import { Header } from '@/components/layout/Header'; // <-- Import Header
import { Footer } from '@/components/layout/Footer'; // <-- Import Footer

const defaultUrl = process.env.VERCEL_URL
  ? `https://{process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Barangay XYZ',
  description: 'The official management system for Barangay XYZ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <Header /> {/* <-- Add Header here */}
          <main className="flex-1">
            {children}
          </main>
          <Footer /> {/* <-- Add Footer here */}
        </div>
      </body>
    </html>
  );
}