import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sebastian Chanzu Blog',
  description: 'A modern blog built with Next.js and TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="App">
            <Navbar />
            <div className="content">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}