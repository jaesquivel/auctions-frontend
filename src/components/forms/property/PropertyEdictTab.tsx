'use client';

import { useTranslations } from 'next-intl';
import type { Property } from '@/types';

interface PropertyEdictTabProps {
  property?: Property | null;
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <p className="text-sm">
      <span className="font-semibold text-muted-foreground">{label}:</span>{' '}
      <span>{value ?? '-'}</span>
    </p>
  );
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
        <div className="rounded-md border p-3 space-y-1">
          <p className="text-sm font-semibold text-muted-foreground mb-1">{t('creditor')}</p>
          <Field label={t('name')} value={edict.creditor?.name} />
          <Field label={t('creditorMargin')} value={edict.creditor?.margin != null ? `${edict.creditor.margin}%` : null} />
        </div>
        <div className="rounded-md border p-3 space-y-1">
          <p className="text-sm font-semibold text-muted-foreground mb-1">{t('debtor')}</p>
          <Field label={t('name')} value={edict.debtor?.name} />
        </div>
      </div>

      {/* Case info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t('caseNumber')} value={edict.caseNumber} />
        <Field label={t('reference')} value={edict.reference} />
        <Field label={t('court')} value={edict.court} />
        <Field label={t('publication')} value={edict.publication != null ? `${edict.publication}/${edict.publicationCount ?? '?'}` : null} />
      </div>

      {/* Judiciary Office */}
      {edict.judiciaryOffice && (
        <div className="rounded-md border p-3 space-y-1">
          <p className="text-sm font-semibold text-muted-foreground mb-1">{t('judiciaryOffice')}</p>
          <Field label={t('sigapjCode')} value={edict.judiciaryOffice.sigapjCode} />
          <Field label={t('name')} value={edict.judiciaryOffice.officeName} />
        </div>
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

      {/* Bulletin */}
      {edict.bulletin && (
        <Field label={t('bulletin')} value={`${edict.bulletin.year} vol. ${edict.bulletin.volume}`} />
      )}

    </div>
  );
}
