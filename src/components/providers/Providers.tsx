'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { esES, enUS } from '@clerk/localizations';

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
}

const clerkLocalizations = {
  es: esES,
  en: enUS,
};

export function Providers({ children, locale }: ProvidersProps) {
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