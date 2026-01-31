'use client';

import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { esES, enUS } from '@clerk/localizations';
import { setToastLocale } from '@/lib/toast';

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
}

const clerkLocalizations = {
  es: esES,
  en: enUS,
};

export function Providers({ children, locale }: ProvidersProps) {
  // Sync toast locale with app locale
  useEffect(() => {
    setToastLocale(locale);
  }, [locale]);

  return (
    <ClerkProvider
      localization={clerkLocalizations[locale as keyof typeof clerkLocalizations] || esES}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
}