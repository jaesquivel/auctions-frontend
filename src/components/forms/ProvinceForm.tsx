'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Province, ProvinceCreateRequest } from '@/types';

interface ProvinceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  province?: Province | null;
  onSubmit: (data: ProvinceCreateRequest) => void;
}

export function ProvinceForm({ open, onOpenChange, province, onSubmit }: ProvinceFormProps) {
  const t = useTranslations('territorial');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState<ProvinceCreateRequest>({
    num: province?.num || 0,
    code: province?.code || '',
    name: province?.name || '',
    nameSearch: province?.nameSearch || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        num: province?.num || 0,
        code: province?.code || '',
        name: province?.name || '',
        nameSearch: province?.nameSearch || '',
      });
    }
  }, [open, province]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const isEdit = !!province;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editProvince') : t('addProvince')}
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
              placeholder="SJ"
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
            placeholder="San José"
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.nameSearch')}</label>
          <Input
            value={formData.nameSearch}
            onChange={(e) => setFormData((prev) => ({ ...prev, nameSearch: e.target.value }))}
            placeholder="SAN JOSE"
            maxLength={100}
          />
        </div>
      </form>
    </Modal>
  );
}