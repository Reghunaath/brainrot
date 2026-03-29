import type { Metadata } from 'next';
import './globals.css';
import { UserProvider, UserSelector } from '@/components/UserContext';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'brainrot',
  description: 'a social media app for the chronically online generation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
        <UserProvider>
          {/* Top bar */}
          <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#1a1a1a] px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
            <Link href="/" className="brainrot-logo text-2xl text-[#c084fc]">
              brainrot
            </Link>
            <UserSelector />
          </header>

          {/* Main content */}
          <main className="max-w-lg mx-auto pb-20">
            {children}
          </main>

          {/* Bottom tab bar */}
          <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] z-50">
            <div className="max-w-lg mx-auto flex">
              <Link href="/" className="flex-1 flex flex-col items-center py-3 text-[#fafafa] hover:text-[#c084fc] transition-colors">
                <span className="text-xl">🏠</span>
                <span className="text-xs mt-1">home</span>
              </Link>
              <Link href="/" className="flex-1 flex flex-col items-center py-3 text-[#fafafa] hover:text-[#c084fc] transition-colors">
                <span className="text-xl">✏️</span>
                <span className="text-xs mt-1">post</span>
              </Link>
              <Link href="/profile/skibidi_steve" className="flex-1 flex flex-col items-center py-3 text-[#fafafa] hover:text-[#c084fc] transition-colors">
                <span className="text-xl">👤</span>
                <span className="text-xs mt-1">profile</span>
              </Link>
            </div>
          </nav>
        </UserProvider>
      </body>
    </html>
  );
}
