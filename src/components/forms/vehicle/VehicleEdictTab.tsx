'use client';

import { useTranslations } from 'next-intl';
import { StringField } from '@/components/ui/string-field';
import { PercentField } from '@/components/ui/percent-field';
import { TextField } from '@/components/ui/text-field';
import type { Vehicle } from '@/types';

interface VehicleEdictTabProps {
  vehicle?: Vehicle | null;
}

export function VehicleEdictTab({ vehicle }: VehicleEdictTabProps) {
  const t = useTranslations('vehicles.form');
  const edict = vehicle?.asset?.edict;

  const publicationValue = edict?.publication != null
    ? `${edict.publication}/${edict.publicationCount ?? '?'}`
    : undefined;

  const bulletinValue = edict?.bulletin
    ? `${edict.bulletin.year} vol. ${edict.bulletin.volume}`
    : undefined;

  return (
    <div className="space-y-4">
      {/* Parties */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold">{t('parties')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <StringField mode="readonly" label={t('creditor')} value={edict?.creditor?.name} />
          <StringField mode="readonly" label={t('debtor')} value={edict?.debtor?.name} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <PercentField mode="readonly" label={t('creditorMargin')} value={edict?.creditor?.margin} decimals={0} />
        </div>
      </fieldset>

      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold">{t('case')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextField mode="readonly" label={t('caseNumber')} value={edict?.caseNumber} className="max-w-50" />
          <StringField mode="readonly" label={t('reference')} value={edict?.reference} className="max-w-50" />
          <StringField mode="readonly" label={t('bulletinPub')} value={bulletinValue && publicationValue ? `${bulletinValue}, ${publicationValue}` : undefined} className="max-w-50" />
          <StringField mode="readonly" label={t('court')} value={edict?.court} className="max-w-150" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StringField mode="readonly" label={t('judiciaryOffice')} value={edict?.judiciaryOffice?.officeName} className="max-w-150" />
          <StringField mode="readonly" label={t('sigapjCode')} value={edict?.judiciaryOffice?.sigapjCode != null ? String(edict.judiciaryOffice.sigapjCode) : undefined} className="max-w-50" />
        </div>
      </fieldset>

      <div className="space-y-1">
        <TextField mode="readonly" label={t('notes')} value={edict?.notes ?? undefined} className="max-h-20" />
      </div>

      <div className="space-y-1">
        <TextField mode="readonly" label={t('fullText')} value={edict?.fullText ?? undefined} className="max-h-40" />
      </div>
    </div>
  );
}
