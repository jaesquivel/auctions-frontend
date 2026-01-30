'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Property, PropertyCreateRequest, PropertyUpdateRequest } from '@/types';

interface PropertyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSubmit: (data: PropertyCreateRequest | PropertyUpdateRequest) => void;
}

export function PropertyForm({ open, onOpenChange, property, onSubmit }: PropertyFormProps) {
  const t = useTranslations('properties');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    assetId: '',
    fiscalValue: property?.fiscalValue?.toString() || '',
    marketValue: property?.marketValue?.toString() || '',
    appraisalValue: property?.appraisalValue?.toString() || '',
    usdExchangeRate: property?.usdExchangeRate?.toString() || '515',
    observations: property?.observations || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: PropertyCreateRequest | PropertyUpdateRequest = {
      ...(property ? {} : { assetId: formData.assetId }),
      fiscalValue: formData.fiscalValue ? parseFloat(formData.fiscalValue) : undefined,
      marketValue: formData.marketValue ? parseFloat(formData.marketValue) : undefined,
      appraisalValue: formData.appraisalValue ? parseFloat(formData.appraisalValue) : undefined,
      usdExchangeRate: formData.usdExchangeRate ? parseFloat(formData.usdExchangeRate) : undefined,
      observations: formData.observations || undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const isEdit = !!property;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editProperty') : t('addProperty')}
      size="lg"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {tCommon('save')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Asset ID</label>
            <Input
              value={formData.assetId}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              placeholder="Select an asset"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.fiscalValue')} (CRC)</label>
            <Input
              type="number"
              value={formData.fiscalValue}
              onChange={(e) => setFormData({ ...formData, fiscalValue: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.marketValue')} (CRC)</label>
            <Input
              type="number"
              value={formData.marketValue}
              onChange={(e) => setFormData({ ...formData, marketValue: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.appraisalValue')} (CRC)</label>
            <Input
              type="number"
              value={formData.appraisalValue}
              onChange={(e) => setFormData({ ...formData, appraisalValue: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">USD Exchange Rate</label>
            <Input
              type="number"
              value={formData.usdExchangeRate}
              onChange={(e) => setFormData({ ...formData, usdExchangeRate: e.target.value })}
              placeholder="515"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Observations</label>
          <textarea
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Optional observations"
            className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
          />
        </div>
      </form>
    </Modal>
  );
}