'use client';

import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';
import { NumericInput } from '@/components/ui/numeric-input';
import { formatCurrency, formatRatio, formatDate } from '@/lib/formatters';
import type { Property } from '@/types';

interface PropertyInfoTabProps {
  property?: Property | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  readOnly: boolean;
}

export function PropertyInfoTab({ property, formData, setFormData, readOnly }: PropertyInfoTabProps) {
  const t = useTranslations('properties.form');

  const updateField = (field: string) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updateText = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const moneyDisplay = (value: string) => (
    <div className="flex h-9 w-full max-w-[150px] items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm text-right text-muted-foreground">
      {value ? formatCurrency(Number(value)) : '-'}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Calculated values (read-only) */}
      {property && (
        <div className="rounded-md border p-3 bg-muted/50 space-y-1 text-sm">
          <p className="font-semibold text-muted-foreground mb-2">{t('calculatedValues')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground">
            <p className="text-right"><span className="font-medium">{t('fiscalValueUsd')}:</span> {formatCurrency(property.fiscalValueUsd)}</p>
            <p className="text-right"><span className="font-medium">{t('firstBaseAdj')}:</span> {formatCurrency(property.firstAuctionBaseAdj)}</p>
            <p className="text-right"><span className="font-medium">{t('firstGuarantee')}:</span> {formatCurrency(property.firstAuctionGuarantee)}</p>
            <p className="text-right"><span className="font-medium">{t('fiscalBaseRatio')}:</span> {formatRatio(property.fiscalBaseRatio)}</p>
          </div>
        </div>
      )}

      {/* Asset info (read-only) */}
      {property?.asset && (
        <div className="rounded-md border p-3 bg-muted/50 space-y-2 text-sm">
          <p className="font-semibold text-muted-foreground mb-2">{t('registrationInfo')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground">
            {property.asset.registration && (
              <p><span className="font-medium">{t('registration')}:</span> {property.asset.registration}</p>
            )}
            {property.asset.propertyNumber && (
              <p><span className="font-medium">{t('propertyNumber')}:</span> {property.asset.propertyNumber}</p>
            )}
            {property.asset.type && (
              <p><span className="font-medium">{t('type')}:</span> {property.asset.type}</p>
            )}
            {property.asset.plate && (
              <p><span className="font-medium">{t('plate')}:</span> {property.asset.plate}</p>
            )}
            {property.asset.duplicate && (
              <p><span className="font-medium">{t('duplicate')}:</span> {property.asset.duplicate}</p>
            )}
            {property.asset.horizontal && (
              <p><span className="font-medium">{t('horizontal')}:</span> {property.asset.horizontal}</p>
            )}
            {property.asset.subRegistration && (
              <p><span className="font-medium">{t('subRegistration')}:</span> {property.asset.subRegistration}</p>
            )}
            {property.asset.currency && (
              <p><span className="font-medium">{t('currency')}:</span> {property.asset.currency}</p>
            )}
            {property.asset.area != null && (
              <p><span className="font-medium">{t('area')}:</span> {formatCurrency(property.asset.area)}</p>
            )}
          </div>
          {/* Territorial Division */}
          {(property.asset.tdProvince || property.asset.tdCanton || property.asset.tdDistrict) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground pt-1">
              {property.asset.tdProvince && (
                <p><span className="font-medium">{t('province')}:</span> {property.asset.tdProvince.name}</p>
              )}
              {property.asset.tdCanton && (
                <p><span className="font-medium">{t('canton')}:</span> {property.asset.tdCanton.name}</p>
              )}
              {property.asset.tdDistrict && (
                <p><span className="font-medium">{t('district')}:</span> {property.asset.tdDistrict.name}</p>
              )}
            </div>
          )}
          {/* Auction Schedule */}
          {(property.asset.firstAuctionTs || property.asset.secondAuctionTs || property.asset.thirdAuctionTs) && (
            <div className="pt-1">
              <p className="font-semibold text-muted-foreground mb-1">{t('auctionSchedule')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground">
                {property.asset.firstAuctionTs && (
                  <p><span className="font-medium">{t('firstAuction')}:</span> {formatDate(property.asset.firstAuctionTs)} — {formatCurrency(property.asset.firstAuctionBase)}</p>
                )}
                {property.asset.secondAuctionTs && (
                  <p><span className="font-medium">{t('secondAuction')}:</span> {formatDate(property.asset.secondAuctionTs)} — {formatCurrency(property.asset.secondAuctionBase)}</p>
                )}
                {property.asset.thirdAuctionTs && (
                  <p><span className="font-medium">{t('thirdAuction')}:</span> {formatDate(property.asset.thirdAuctionTs)} — {formatCurrency(property.asset.thirdAuctionBase)}</p>
                )}
              </div>
            </div>
          )}
          {/* Rights, Liens, Description */}
          {property.asset.rights && (
            <p className="text-muted-foreground"><span className="font-medium">{t('rights')}:</span> {property.asset.rights}</p>
          )}
          {property.asset.liens && (
            <p className="text-muted-foreground"><span className="font-medium">{t('liens')}:</span> {property.asset.liens}</p>
          )}
          {property.asset.description && (
            <p className="text-muted-foreground"><span className="font-medium">{t('description')}:</span> {property.asset.description}</p>
          )}
        </div>
      )}

      {/* Editable values */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('values')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('fiscalValue')}</label>
            {readOnly ? moneyDisplay(formData.fiscalValue) : (
              <NumericInput value={formData.fiscalValue} onChange={updateField('fiscalValue')} />
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('usdExchangeRate')}</label>
            {readOnly ? moneyDisplay(formData.usdExchangeRate) : (
              <NumericInput value={formData.usdExchangeRate} onChange={updateField('usdExchangeRate')} />
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('marketValue')}</label>
            {readOnly ? moneyDisplay(formData.marketValue) : (
              <NumericInput value={formData.marketValue} onChange={updateField('marketValue')} />
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('appraisalValue')}</label>
            {readOnly ? moneyDisplay(formData.appraisalValue) : (
              <NumericInput value={formData.appraisalValue} onChange={updateField('appraisalValue')} />
            )}
          </div>
        </div>
      </fieldset>

      {/* Observations */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('observations')}</label>
        <Textarea value={formData.observations} onChange={updateText('observations')} rows={4} disabled={readOnly} />
      </div>

      {/* Location */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('location')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">{t('locationStreet')}</p>
            <div className="flex gap-3 items-end">
              <div className="space-y-1">
                <label className="block text-xs text-muted-foreground">{t('latitude')}</label>
                <NumericInput value={formData.locationStLat} onChange={updateField('locationStLat')} disabled={readOnly} />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-muted-foreground">{t('longitude')}</label>
                <NumericInput value={formData.locationStLon} onChange={updateField('locationStLon')} disabled={readOnly} />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">{t('locationCenter')}</p>
            <div className="flex gap-3 items-end">
              <div className="space-y-1">
                <label className="block text-xs text-muted-foreground">{t('latitude')}</label>
                <NumericInput value={formData.locationCenterLat} onChange={updateField('locationCenterLat')} disabled={readOnly} />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-muted-foreground">{t('longitude')}</label>
                <NumericInput value={formData.locationCenterLon} onChange={updateField('locationCenterLon')} disabled={readOnly} />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Location lat,lon:{' '}
            {formData.locationStLat || '0.00000000'},{formData.locationStLon || '0.00000000'}
          </p>
          <p className="text-xs text-muted-foreground">
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
      </fieldset>

    </div>
  );
}
