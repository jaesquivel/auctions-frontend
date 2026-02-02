'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Canton, CantonCreateRequest, Province } from '@/types';

interface CantonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canton?: Canton | null;
  province: Province;
  onSubmit: (data: CantonCreateRequest) => void;
}

export function CantonForm({ open, onOpenChange, canton, province, onSubmit }: CantonFormProps) {
  const t = useTranslations('territorial');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState<Omit<CantonCreateRequest, 'provinceId'>>({
    num: canton?.num || 0,
    code: canton?.code || '',
    name: canton?.name || '',
    nameSearch: canton?.nameSearch || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        num: canton?.num || 0,
        code: canton?.code || '',
        name: canton?.name || '',
        nameSearch: canton?.nameSearch || '',
      });
    }
  }, [open, canton]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, provinceId: province.id });
    onOpenChange(false);
  };

  const isEdit = !!canton;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editCanton') : t('addCanton')}
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
          <span className="text-sm text-muted-foreground">{t('provinces')}: </span>
          <span className="text-sm font-medium">{province.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.num')}</label>
            <Input
              type="number"
              value={formData.num}
              onChange={(e) => setFormData((prev) => ({ ...prev, num: parseInt(e.target.value) || 0 }))}
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.code')}</label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
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
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.nameSearch')}</label>
          <Input
            value={formData.nameSearch}
            onChange={(e) => setFormData((prev) => ({ ...prev, nameSearch: e.target.value }))}
            maxLength={100}
          />
        </div>
      </form>
    </Modal>
  );
}