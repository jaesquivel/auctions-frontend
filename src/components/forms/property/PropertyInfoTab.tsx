'use client';

import { useTranslations } from 'next-intl';
import { CurrencyField } from '@/components/ui/currency-field';
import { NumericField } from '@/components/ui/numeric-field';
import { PercentField } from '@/components/ui/percent-field';
import { DateTimeField } from '@/components/ui/datetime-field';
import { TextField } from '@/components/ui/text-field';
import { StringField } from '@/components/ui/string-field';
import type { Property } from '@/types';
import { UnitField } from '@/components/ui/unit-field';

interface PropertyInfoTabProps {
  property?: Property | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  readOnly: boolean;
}

export function PropertyInfoTab({ property, formData, setFormData, readOnly }: PropertyInfoTabProps) {
  const t = useTranslations('properties.form');
  const cur = property?.asset?.currency ?? '';
  const fieldMode = readOnly ? 'readonly' : 'edit';

  const updateField = (field: string) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const asset = property?.asset;
  const tdDistrictId = asset?.tdDistrict?.id ?? null;
  const tdCantonId = asset?.tdCanton?.id ?? null;

  const tdLocationLabel = [
    asset?.tdProvince?.name,
    asset?.tdCanton?.name,
    asset?.tdDistrict?.name,
  ].filter(Boolean).join(', ') || null;

  return (
    <div className="space-y-4">
      {/* Auction */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold">{t('auction')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <div className="space-y-2">
            <DateTimeField mode="readonly" label={t('firstAuction')} value={property?.asset?.firstAuctionTs} />
            <CurrencyField mode="readonly" value={property?.asset?.firstAuctionBase} currency={cur} />
          </div>
          <div className="space-y-2">
            <DateTimeField mode="readonly" label={t('secondAuction')} value={property?.asset?.secondAuctionTs} />
            <CurrencyField mode="readonly" value={property?.asset?.secondAuctionBase} currency={cur} />
          </div>
          <div className="space-y-2">
            <DateTimeField mode="readonly" label={t('thirdAuction')} value={property?.asset?.thirdAuctionTs} />
            <CurrencyField mode="readonly" value={property?.asset?.thirdAuctionBase} currency={cur} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <CurrencyField mode="readonly" label={t('firstGuarantee')} value={property?.firstAuctionGuarantee} currency={cur} />
          <CurrencyField mode="readonly" label={t('firstBaseAdj')} value={property?.firstAuctionBaseAdj} currency='USD' />
          <StringField mode="readonly" label={t('currency')} value={property?.asset?.currency} className="max-w-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-x-4 gap-y-3">
          <TextField mode="readonly" label={t('liens')} value={property?.asset?.liens} />
          <TextField mode="readonly" label={t('description')} value={property?.asset?.description} />
        </div>
      </fieldset>

      {/* Valuation */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('valuation')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CurrencyField mode={fieldMode} label={t('marketValue')} value={formData.marketValue} onChange={updateField('marketValue')} currency="USD" />
          <CurrencyField mode={fieldMode} label={t('appraisalValue')} value={formData.appraisalValue} onChange={updateField('appraisalValue')} currency="USD" />
          <PercentField mode="readonly" label={t('fiscalBaseRatio')} value={property?.fiscalBaseRatio} decimals={0} />
          <CurrencyField mode={fieldMode} label={t('fiscalValue')} value={formData.fiscalValue} onChange={updateField('fiscalValue')} currency="CRC" />
          <CurrencyField mode="readonly" label={t('fiscalValueUsd')} value={property?.fiscalValueUsd} currency="USD" />
          <NumericField mode={fieldMode} label={t('usdExchangeRate')} value={formData.usdExchangeRate} onChange={updateField('usdExchangeRate')} decimals={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StringField mode="readonly" label={t('tdLocation')} value={tdLocationLabel ?? undefined} className="max-w-150" />
          <UnitField mode={fieldMode} label={t('area')} value={property?.asset?.area} unit="m²" />
        </div>
      </fieldset>

      <TextField mode={fieldMode} label={t('observations')} value={formData.observations} onChange={updateField('observations')} rows={4} />
    </div>
  );
}