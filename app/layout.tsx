/**
 * BugSage - Your AI Debugging Mentor
 * Copyright (c) 2025 Michael Ilerioluwa Adeniyi
 * MIT License - See LICENSE file for details
 */

import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BugSage - Your AI Debugging Mentor',
  description: 'AI-powered debugging assistant that helps analyze logs and find root causes',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen bg-gray-50`}>
          <main className="w-full overflow-x-hidden">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
