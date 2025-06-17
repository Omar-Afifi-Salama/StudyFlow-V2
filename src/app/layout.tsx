import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from '@/contexts/SessionContext';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'StudyFlow',
  description: 'Track your study sessions and boost productivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <SessionProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
