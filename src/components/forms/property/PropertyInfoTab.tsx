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
  const cur = property?.asset?.currency;
  const fieldMode = readOnly ? 'readonly' : 'edit';

  const updateField = (field: string) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      {/* Auction Info */}
      {property?.asset && (
        <fieldset className="rounded-md border space-y-3 p-3">
          <legend className="text-sm font-semibold">{t('auctionSchedule')}</legend>

          {(property.asset.firstAuctionTs || property.asset.secondAuctionTs || property.asset.thirdAuctionTs) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
              {property.asset.firstAuctionTs && (
                <div className="space-y-2">
                  <DateTimeField mode="readonly" label={t('firstAuction')} value={property.asset.firstAuctionTs} />
                  <CurrencyField mode="readonly" value={property.asset.firstAuctionBase} currency={cur ?? ''} />
                </div>
              )}
              {property.asset.secondAuctionTs && (
                <div className="space-y-2">
                  <DateTimeField mode="readonly" label={t('secondAuction')} value={property.asset.secondAuctionTs} />
                  <CurrencyField mode="readonly" value={property.asset.secondAuctionBase} currency={cur ?? ''} />
                </div>
              )}
              {property.asset.thirdAuctionTs && (
                <div className="space-y-2">
                  <DateTimeField mode="readonly" label={t('thirdAuction')} value={property.asset.thirdAuctionTs} />
                  <CurrencyField mode="readonly" value={property.asset.thirdAuctionBase} currency={cur ?? ''} />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
            {property.firstAuctionGuarantee && (
              <CurrencyField mode="readonly" label={t('firstGuarantee')} value={property.firstAuctionGuarantee} currency={cur ?? ''} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
            {property.firstAuctionBaseAdj && (
              <CurrencyField mode="readonly" label={t('firstBaseAdj')} value={property.firstAuctionBaseAdj} currency={cur ?? ''} />
            )}
            {property?.asset.currency && (
              <StringField mode="readonly" label={t('currency')} value={property.asset.currency} className='max-w-50' />
            )}
          </div>
        </fieldset>
      )}

      {/* Property */}
      <fieldset className="rounded-md border space-y-3 p-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('location')}</legend>

        {/* Territorial Division */}
        {( property?.asset && property.asset.tdProvince && property.asset.tdCanton && property.asset.tdDistrict) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground text-sm pt-1">
            {property.asset.tdProvince && (
              <StringField mode="readonly" label={t('tdLocation')} value={property.asset.tdProvince?.name + ", " + property.asset.tdCanton?.name + ", " + property.asset.tdDistrict?.name} />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">{t('locationStreet')}</p>
            <NumericField mode={fieldMode} label={t('latitude')} value={formData.locationStLat} onChange={updateField('locationStLat')} decimals={8} />
            <NumericField mode={fieldMode} label={t('longitude')} value={formData.locationStLon} onChange={updateField('locationStLon')} decimals={8} />
          </div>
          <div className="space-y-6 self-end">
            <p className="text-sm text-muted-foreground">
              Location lat,lon:{' '}
              {formData.locationStLat || '0.00000000'},{formData.locationStLon || '0.00000000'}
            </p>
            <p className="text-sm text-muted-foreground">
              Waze:{' '}
              <a
                href={`https://waze.com/ul?ll=${formData.locationStLat || '0.00000000'},${formData.locationStLon || '0.00000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {`https://waze.com/ul?ll=${formData.locationStLat || '0.00000000'},${formData.locationStLon || '0.00000000'}`}
              </a>
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">{t('locationCenter')}</p>
            <NumericField mode={fieldMode} label={t('latitude')} value={formData.locationCenterLat} onChange={updateField('locationCenterLat')} decimals={8} />
            <NumericField mode={fieldMode} label={t('longitude')} value={formData.locationCenterLon} onChange={updateField('locationCenterLon')} decimals={8} />
          </div>
        </div>
      </fieldset>

          {property?.asset.liens && (
            <TextField mode="readonly" label={t('liens')} value={property.asset.liens} />
          )}
          {property?.asset.description && (
            <TextField mode="readonly" label={t('description')} value={property.asset.description} />
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground text-sm">
            {property?.asset.area != null && (
              <UnitField mode="readonly" label={t('area')} value={property.asset.area} unit='m²'/>
            )}
          </div>

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
      </fieldset>

      <TextField mode={fieldMode} label={t('observations')} value={formData.observations} onChange={updateField('observations')} rows={4} />

    </div>
  );
}
