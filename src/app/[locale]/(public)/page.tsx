import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Gavel, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');

  return (
    <>
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full">
              <Gavel className="h-16 w-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href={`/${locale}/sign-in`}>
                {t('signIn')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href={`/${locale}/sign-up`}>
                {t('signUp')}
              </Link>
            </Button>

            <Button asChild variant="ghost" size="lg" className="gap-2">
              <Link href={`/${locale}/info`}>
                <Info className="h-4 w-4" />
                {t('learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer with copyright */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          {tCommon('copyright')}
        </div>
      </footer>
    </>
  );
}