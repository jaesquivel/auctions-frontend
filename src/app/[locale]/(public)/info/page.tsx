import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Gavel, ArrowLeft, Building2, Car, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('info');
  const tCommon = await getTranslations('common');
  const tHome = await getTranslations('home');

  const features = [
    { icon: Building2, title: locale === 'es' ? 'Propiedades' : 'Properties', description: locale === 'es' ? 'Gestión completa de propiedades en remate' : 'Complete property auction management' },
    { icon: Car, title: locale === 'es' ? 'Vehículos' : 'Vehicles', description: locale === 'es' ? 'Seguimiento de vehículos en subasta' : 'Vehicle auction tracking' },
    { icon: FileText, title: locale === 'es' ? 'Edictos' : 'Edicts', description: locale === 'es' ? 'Procesamiento automático de edictos judiciales' : 'Automatic judicial edict processing' },
    { icon: Shield, title: locale === 'es' ? 'Seguro' : 'Secure', description: locale === 'es' ? 'Autenticación segura con verificación de dos factores' : 'Secure authentication with two-factor verification' },
  ];

  return (
    <>
      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <Gavel className="h-5 w-5" />
              <span className="font-semibold">{tCommon('appName')}</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
            <p className="text-xl text-muted-foreground mb-12">{t('description')}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 rounded-lg border border-border bg-card">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg">
                <Link href={`/${locale}/sign-up`}>
                  {tHome('signUp')}
                </Link>
              </Button>
            </div>
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