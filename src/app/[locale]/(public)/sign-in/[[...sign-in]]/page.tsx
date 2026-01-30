import { SignIn } from '@clerk/nextjs';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Gavel } from 'lucide-react';

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Link href={`/${locale}`} className="flex items-center gap-2 mb-8">
        <Gavel className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">
          {locale === 'es' ? 'Remates Judiciales' : 'Judicial Auctions'}
        </span>
      </Link>

      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-card border border-border shadow-lg',
            headerTitle: 'text-foreground',
            headerSubtitle: 'text-muted-foreground',
            socialButtonsBlockButton: 'border-border bg-background hover:bg-accent',
            formFieldLabel: 'text-foreground',
            formFieldInput: 'bg-background border-input',
            footerActionLink: 'text-primary hover:text-primary/80',
            formButtonPrimary: 'bg-primary hover:bg-primary/90',
          },
        }}
        routing="path"
        path={`/${locale}/sign-in`}
        signUpUrl={`/${locale}/sign-up`}
        forceRedirectUrl={`/${locale}/properties`}
      />
    </main>
  );
}