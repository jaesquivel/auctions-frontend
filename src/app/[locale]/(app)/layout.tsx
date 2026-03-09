import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { UserMenu } from '@/components/layout/UserMenu';
import { PermissionsProvider } from '@/contexts/PermissionsContext';
import { Gavel } from 'lucide-react';
import Link from 'next/link';

interface AppLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale } = await params;

  return (
    <PermissionsProvider>
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-background">
          <Link href={`/${locale}/properties`} className="flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">
              {locale === 'es' ? 'Remates' : 'Auctions'}
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle collapsed />
            <LanguageSelector collapsed />
            <UserMenu collapsed />
            <MobileNav />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
    </PermissionsProvider>
  );
}