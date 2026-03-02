'use client';

import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider, useTheme } from 'next-themes';
import { dark } from '@clerk/themes';
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

function ClerkWithTheme({ children, locale }: ProvidersProps) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      localization={clerkLocalizations[locale as keyof typeof clerkLocalizations] || esES}
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children, locale }: ProvidersProps) {
  // Sync toast locale with app locale
  useEffect(() => {
    setToastLocale(locale);
  }, [locale]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkWithTheme locale={locale}>
        {children}
      </ClerkWithTheme>
    </ThemeProvider>
  );
}