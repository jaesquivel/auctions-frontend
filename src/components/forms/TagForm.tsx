'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PropertyTag, PropertyTagCreateRequest, PropertyTagUpdateRequest } from '@/types';

interface TagFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: PropertyTag | null;
  onSubmit: (data: PropertyTagCreateRequest | PropertyTagUpdateRequest) => void;
}

export function TagForm({ open, onOpenChange, tag, onSubmit }: TagFormProps) {
  const t = useTranslations('tags');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    name: tag?.name || '',
    description: tag?.description || '',
    color: tag?.color || '#4CAF50',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const isEdit = !!tag;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editTag') : t('addTag')}
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
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.name')}</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Residencial"
            required
            maxLength={30}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.description')}</label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.color')}</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-10 w-14 rounded border border-input cursor-pointer"
            />
            <Input
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="#RRGGBB"
              pattern="^#[0-9A-Fa-f]{6}$"
              className="flex-1"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}