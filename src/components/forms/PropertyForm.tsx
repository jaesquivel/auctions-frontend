'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TagBadge } from '@/components/ui/tag-badge';
import type { Property, PropertyListItem, PropertyUpdateRequest, PropertyTag } from '@/types';

interface PropertyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  listItem?: PropertyListItem | null;
  onSubmit: (data: PropertyUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
  availableTags?: PropertyTag[];
}

export function PropertyForm({ open, onOpenChange, property, listItem, onSubmit, readOnly = false, loading = false, availableTags = [] }: PropertyFormProps) {
  const t = useTranslations('properties');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    fiscalValue: property?.fiscalValue?.toString() || '',
    marketValue: property?.marketValue?.toString() || '',
    appraisalValue: property?.appraisalValue?.toString() || '',
    usdExchangeRate: property?.usdExchangeRate?.toString() || '',
    observations: property?.observations || '',
    rnpCert: property?.rnpCert || '',
    rnpPlan: property?.rnpPlan || '',
  });

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    property?.tags?.map((t) => t.id) || listItem?.tags?.map((t) => t.id) || []
  );

  useEffect(() => {
    if (property) {
      setFormData({
        fiscalValue: property.fiscalValue?.toString() || '',
        marketValue: property.marketValue?.toString() || '',
        appraisalValue: property.appraisalValue?.toString() || '',
        usdExchangeRate: property.usdExchangeRate?.toString() || '',
        observations: property.observations || '',
        rnpCert: property.rnpCert || '',
        rnpPlan: property.rnpPlan || '',
      });
      setSelectedTagIds(property.tags?.map((t) => t.id) || []);
    } else {
      setFormData({
        fiscalValue: '', marketValue: '', appraisalValue: '', usdExchangeRate: '',
        observations: '', rnpCert: '', rnpPlan: '',
      });
      setSelectedTagIds(listItem?.tags?.map((t) => t.id) || []);
    }
  }, [property, listItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: PropertyUpdateRequest = {
      fiscalValue: formData.fiscalValue ? Number(formData.fiscalValue) : undefined,
      marketValue: formData.marketValue ? Number(formData.marketValue) : undefined,
      appraisalValue: formData.appraisalValue ? Number(formData.appraisalValue) : undefined,
      usdExchangeRate: formData.usdExchangeRate ? Number(formData.usdExchangeRate) : undefined,
      observations: formData.observations || undefined,
      rnpCert: formData.rnpCert || undefined,
      rnpPlan: formData.rnpPlan || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const isEdit = !!property;

  const getTitle = () => {
    if (readOnly) return t('viewProperty');
    return isEdit ? t('editProperty') : t('addProperty');
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="lg"
      footer={
        readOnly ? (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon('close')}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {tCommon('save')}
            </Button>
          </div>
        )
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">{tCommon('loading')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Read-only info from nested edict/asset */}
          {isEdit && (
            <div className="rounded-md border p-3 bg-muted/50 space-y-1 text-sm text-muted-foreground">
              {property?.edict?.creditor && (
                <p><span className="font-medium">{t('form.creditor')}:</span> {property.edict.creditor.name}</p>
              )}
              {property?.edict?.debtor && (
                <p><span className="font-medium">{t('form.debtor')}:</span> {property.edict.debtor.name}</p>
              )}
              {property?.edict?.court && (
                <p><span className="font-medium">{t('form.court')}:</span> {property.edict.court}</p>
              )}
              {property?.asset?.registration && (
                <p><span className="font-medium">{t('form.registration')}:</span> {property.registrationFull || property.asset.registration}</p>
              )}
              {property?.asset?.tdProvince && (
                <p><span className="font-medium">{t('form.province')}:</span> {property.asset.tdProvince.name}</p>
              )}
              {property?.asset?.tdCanton && (
                <p><span className="font-medium">{t('form.canton')}:</span> {property.asset.tdCanton.name}</p>
              )}
              {property?.asset?.tdDistrict && (
                <p><span className="font-medium">{t('form.district')}:</span> {property.asset.tdDistrict.name}</p>
              )}
            </div>
          )}

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.values')}</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.fiscalValue')}</label>
                <Input
                  type="number"
                  value={formData.fiscalValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fiscalValue: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.usdExchangeRate')}</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.usdExchangeRate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, usdExchangeRate: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.marketValue')}</label>
                <Input
                  type="number"
                  value={formData.marketValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, marketValue: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.appraisalValue')}</label>
                <Input
                  type="number"
                  value={formData.appraisalValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, appraisalValue: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.details')}</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.rnpCert')}</label>
                <Input
                  value={formData.rnpCert}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rnpCert: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.rnpPlan')}</label>
                <Input
                  value={formData.rnpPlan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rnpPlan: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('form.observations')}</label>
              <Textarea
                value={formData.observations}
                onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                rows={4}
                disabled={readOnly}
              />
            </div>
          </fieldset>

          {/* Tags */}
          {availableTags.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-muted-foreground">{t('form.tags')}</legend>
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
        </form>
      )}
    </Modal>
  );
}