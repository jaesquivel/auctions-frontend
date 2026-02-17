'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TagBadge } from '@/components/ui/tag-badge';
import { formatCurrency, formatNumber, formatRatio } from '@/lib/formatters';
import type { Property, PropertyTag } from '@/types';

interface PropertyInfoTabProps {
  property?: Property | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedTagIds: string[];
  toggleTag: (tagId: string) => void;
  availableTags: PropertyTag[];
  readOnly: boolean;
}

export function PropertyInfoTab({ property, formData, setFormData, selectedTagIds, toggleTag, availableTags, readOnly }: PropertyInfoTabProps) {
  const t = useTranslations('properties.form');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const moneyDisplay = (value: string) => (
    <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm text-right text-muted-foreground">
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
            <p><span className="font-medium">{t('registration')}:</span> {property.registrationFull || '-'}</p>
            <p className="text-right"><span className="font-medium">{t('fiscalValueUsd')}:</span> {formatCurrency(property.fiscalValueUsd)}</p>
            <p className="text-right"><span className="font-medium">{t('firstBaseAdj')}:</span> {formatCurrency(property.firstAuctionBaseAdj)}</p>
            <p className="text-right"><span className="font-medium">{t('firstGuarantee')}:</span> {formatCurrency(property.firstAuctionGuarantee)}</p>
            <p className="text-right"><span className="font-medium">{t('fiscalBaseRatio')}:</span> {formatRatio(property.fiscalBaseRatio)}</p>
          </div>
        </div>
      )}

      {/* Editable values */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('values')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('fiscalValue')}</label>
            {readOnly ? moneyDisplay(formData.fiscalValue) : (
              <Input type="number" className="text-right" value={formData.fiscalValue} onChange={update('fiscalValue')} />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('usdExchangeRate')}</label>
            {readOnly ? moneyDisplay(formData.usdExchangeRate) : (
              <Input type="number" step="0.01" className="text-right" value={formData.usdExchangeRate} onChange={update('usdExchangeRate')} />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('marketValue')}</label>
            {readOnly ? moneyDisplay(formData.marketValue) : (
              <Input type="number" className="text-right" value={formData.marketValue} onChange={update('marketValue')} />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('appraisalValue')}</label>
            {readOnly ? moneyDisplay(formData.appraisalValue) : (
              <Input type="number" className="text-right" value={formData.appraisalValue} onChange={update('appraisalValue')} />
            )}
          </div>
        </div>
      </fieldset>

      {/* Observations */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('observations')}</label>
        <Textarea value={formData.observations} onChange={update('observations')} rows={4} disabled={readOnly} />
      </div>

      {/* Location */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('locationCenter')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('latitude')}</label>
            <Input type="number" step="any" value={formData.locationCenterLat} onChange={update('locationCenterLat')} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('longitude')}</label>
            <Input type="number" step="any" value={formData.locationCenterLon} onChange={update('locationCenterLon')} disabled={readOnly} />
          </div>
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-muted-foreground">{t('locationStreet')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('latitude')}</label>
            <Input type="number" step="any" value={formData.locationStLat} onChange={update('locationStLat')} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('longitude')}</label>
            <Input type="number" step="any" value={formData.locationStLon} onChange={update('locationStLon')} disabled={readOnly} />
          </div>
        </div>
      </fieldset>

      {/* Tags */}
      {availableTags.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-muted-foreground">{t('tags')}</legend>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => !readOnly && toggleTag(tag.id)}
                className={`rounded-md transition-all ${
                  selectedTagIds.includes(tag.id)
                    ? 'ring-2 ring-primary ring-offset-1'
                    : 'opacity-50 hover:opacity-75'
                }`}
                disabled={readOnly}
              >
                <TagBadge name={tag.name} color={tag.color} />
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
