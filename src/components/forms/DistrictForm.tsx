'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { District, DistrictCreateRequest, Canton } from '@/types';

interface DistrictFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district?: District | null;
  canton: Canton;
  onSubmit: (data: DistrictCreateRequest) => void;
}

export function DistrictForm({ open, onOpenChange, district, canton, onSubmit }: DistrictFormProps) {
  const t = useTranslations('territorial');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState<Omit<DistrictCreateRequest, 'cantonId'>>({
    num: district?.num || 0,
    code: district?.code || '',
    name: district?.name || '',
    nameSearch: district?.nameSearch || '',
    area: district?.area || undefined,
    altitude: district?.altitude || undefined,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        num: district?.num || 0,
        code: district?.code || '',
        name: district?.name || '',
        nameSearch: district?.nameSearch || '',
        area: district?.area || undefined,
        altitude: district?.altitude || undefined,
      });
    }
  }, [open, district]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, cantonId: canton.id });
    onOpenChange(false);
  };

  const isEdit = !!district;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editDistrict') : t('addDistrict')}
      size="sm"
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
        <div className="p-3 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">{t('cantons')}: </span>
          <span className="text-sm font-medium">{canton.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.num')}</label>
            <Input
              type="number"
              value={formData.num}
              onChange={(e) => setFormData((prev) => ({ ...prev, num: parseInt(e.target.value) || 0 }))}
              placeholder="1"
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.code')}</label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              placeholder="10101"
              required
              maxLength={10}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.name')}</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Carmen"
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.nameSearch')}</label>
          <Input
            value={formData.nameSearch}
            onChange={(e) => setFormData((prev) => ({ ...prev, nameSearch: e.target.value }))}
            placeholder="CARMEN"
            maxLength={100}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.area')}</label>
            <Input
              type="number"
              value={formData.area || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="0.00"
              step="0.01"
              min={0}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.altitude')}</label>
            <Input
              type="number"
              value={formData.altitude || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, altitude: e.target.value ? parseInt(e.target.value) : undefined }))}
              placeholder="0"
              min={0}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}