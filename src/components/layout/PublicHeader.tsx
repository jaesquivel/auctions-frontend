'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Gavel } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface PublicHeaderProps {
  showLogo?: boolean;
}

export function PublicHeader({ showLogo = true }: PublicHeaderProps) {
  const locale = useLocale();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {showLogo ? (
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">
              {locale === 'es' ? 'Remates Judiciales' : 'Judicial Auctions'}
            </span>
          </Link>
        ) : (
          <div />
        )}
        <LanguageSelector />
      </div>
    </header>
  );
}