'use client';

import { useTranslations } from 'next-intl';
import { StringField } from '@/components/ui/string-field';
import { PercentField } from '@/components/ui/percent-field';
import type { Property } from '@/types';

interface PropertyEdictTabProps {
  property?: Property | null;
}

export function PropertyEdictTab({ property }: PropertyEdictTabProps) {
  const t = useTranslations('properties.form');
  const edict = property?.asset?.edict;

  if (!edict) {
    return <p className="text-sm text-muted-foreground py-4">{t('noData')}</p>;
  }

  return (
    <div className="space-y-4">
      {/* Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-md border p-3 space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">{t('creditor')}</p>
          <StringField mode="readonly" label={t('name')} value={edict.creditor?.name} />
          <PercentField mode="readonly" label={t('creditorMargin')} value={edict.creditor?.margin} decimals={0} />
        </div>
        <div className="rounded-md border p-3 space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">{t('debtor')}</p>
          <StringField mode="readonly" label={t('name')} value={edict.debtor?.name} />
        </div>
      </div>

      {/* Case info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <StringField mode="readonly" label={t('caseNumber')} value={edict.caseNumber} />
        <StringField mode="readonly" label={t('reference')} value={edict.reference} />
        <StringField mode="readonly" label={t('court')} value={edict.court} />
        <StringField
          mode="readonly"
          label={t('publication')}
          value={edict.publication != null ? `${edict.publication}/${edict.publicationCount ?? '?'}` : undefined}
        />
      </div>

      {/* Judiciary Office */}
      {edict.judiciaryOffice && (
        <div className="rounded-md border p-3 space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">{t('judiciaryOffice')}</p>
          <StringField mode="readonly" label={t('sigapjCode')} value={edict.judiciaryOffice.sigapjCode != null ? String(edict.judiciaryOffice.sigapjCode) : undefined} />
          <StringField mode="readonly" label={t('name')} value={edict.judiciaryOffice.officeName} />
        </div>
      )}

      {/* Bulletin */}
      {edict.bulletin && (
        <StringField
          mode="readonly"
          label={t('bulletin')}
          value={`${edict.bulletin.year} vol. ${edict.bulletin.volume}`}
        />
      )}

      {/* Notes */}
      {edict.notes && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">{t('notes')}</p>
          <div className="rounded-md border p-3 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto bg-muted/30">
            {edict.notes}
          </div>
        </div>
      )}

      {/* Full text */}
      {edict.fullText && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">{t('fullText')}</p>
          <div className="rounded-md border p-3 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/30">
            {edict.fullText}
          </div>
        </div>
      )}
    </div>
  );
}
