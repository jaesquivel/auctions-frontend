'use client';

import { useTranslations } from 'next-intl';
import { CurrencyField } from '@/components/ui/currency-field';
import { NumericField } from '@/components/ui/numeric-field';
import { DateTimeField } from '@/components/ui/datetime-field';
import { TextField } from '@/components/ui/text-field';
import { StringField } from '@/components/ui/string-field';
import type { Vehicle } from '@/types';

interface VehicleInfoTabProps {
  vehicle?: Vehicle | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  readOnly: boolean;
}

export function VehicleInfoTab({ vehicle, formData, setFormData, readOnly }: VehicleInfoTabProps) {
  const t = useTranslations('vehicles.form');
  const cur = vehicle?.asset?.currency ?? 'USD';
  const fieldMode = readOnly ? 'readonly' : 'edit';

  const updateField = (field: string) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      {/* Auction */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold">{t('auction')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <div className="space-y-2">
            <DateTimeField mode="readonly" label={t('firstAuction')} value={vehicle?.asset?.firstAuctionTs} />
            <CurrencyField mode="readonly" value={vehicle?.asset?.firstAuctionBase} currency={cur} />
          </div>
          <div className="space-y-2">
            <DateTimeField mode="readonly" label={t('secondAuction')} value={vehicle?.asset?.secondAuctionTs} />
            <CurrencyField mode="readonly" value={vehicle?.asset?.secondAuctionBase} currency={cur} />
          </div>
          <div className="space-y-2">
            <DateTimeField mode="readonly" label={t('thirdAuction')} value={vehicle?.asset?.thirdAuctionTs} />
            <CurrencyField mode="readonly" value={vehicle?.asset?.thirdAuctionBase} currency={cur} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <CurrencyField mode="readonly" label={t('firstGuarantee')} value={vehicle?.firstAuctionGuarantee} currency={cur} />
          <CurrencyField mode="readonly" label={t('firstBaseAdj')} value={vehicle?.firstAuctionBaseAdj} currency="USD" />
          <StringField mode="readonly" label={t('currency')} value={cur} className="max-w-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <CurrencyField mode="readonly" label={t('contractValue')} value={vehicle?.contractValue} currency={vehicle?.contractCurrency ?? 'USD'} />
        </div>
      </fieldset>

      {/* Valuation */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('valuation')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CurrencyField mode={fieldMode} label={t('marketValue')} value={formData.marketValue} onChange={updateField('marketValue')} currency="USD" />
          <CurrencyField mode={fieldMode} label={t('appraisalValue')} value={formData.appraisalValue} onChange={updateField('appraisalValue')} currency="USD" />
          <CurrencyField mode={fieldMode} label={t('fiscalValue')} value={formData.fiscalValue} onChange={updateField('fiscalValue')} currency="CRC" />
          <CurrencyField mode="readonly" label={t('fiscalValueUsd')} value={vehicle?.fiscalValueUsd} currency="USD" />
          <NumericField mode={fieldMode} label={t('usdExchangeRate')} value={formData.usdExchangeRate} onChange={updateField('usdExchangeRate')} decimals={2} />
        </div>
      </fieldset>

      <TextField mode={fieldMode} label={t('observations')} value={formData.observations} onChange={updateField('observations')} rows={4} />
    </div>
  );
}
