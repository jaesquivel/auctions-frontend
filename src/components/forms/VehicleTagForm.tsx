'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { StringField } from '@/components/ui/string-field';
import type { VehicleTag, VehicleTagCreateRequest, VehicleTagUpdateRequest } from '@/types';

const COLOR_SWATCHES = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#78716C',
  '#64748B', '#1E293B',
];

interface VehicleTagFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: VehicleTag | null;
  onSubmit: (data: VehicleTagCreateRequest | VehicleTagUpdateRequest) => void;
  readOnly?: boolean;
}

export function VehicleTagForm({ open, onOpenChange, tag, onSubmit, readOnly = false }: VehicleTagFormProps) {
  const t = useTranslations('vehicleTags');
  const tCommon = useTranslations('common');
  const fieldMode = readOnly ? 'readonly' : 'edit';

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

  const getTitle = () => {
    if (readOnly) return t('viewTag');
    return isEdit ? t('editTag') : t('addTag');
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="sm"
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
            <Button onClick={handleSubmit}>
              {tCommon('save')}
            </Button>
          </div>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <StringField mode={fieldMode} label={t('columns.name')} value={formData.name} onChange={(v) => setFormData((prev) => ({ ...prev, name: v }))} placeholder="e.g., Sedán" />

        <StringField mode={fieldMode} label={t('columns.description')} value={formData.description} onChange={(v) => setFormData((prev) => ({ ...prev, description: v }))} placeholder="Optional description" />

        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('columns.color')}</label>
          <div className="grid grid-cols-10 gap-1 mb-2">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => !readOnly && setFormData((prev) => ({ ...prev, color }))}
                disabled={readOnly}
                className={cn(
                  'h-6 w-6 rounded border-2 transition-all',
                  formData.color.toUpperCase() === color.toUpperCase()
                    ? 'border-foreground scale-110'
                    : 'border-transparent hover:scale-105',
                  readOnly && 'cursor-not-allowed opacity-70'
                )}
                style={{ backgroundColor: color }}
              >
                {formData.color.toUpperCase() === color.toUpperCase() && (
                  <Check className="h-4 w-4 text-white mx-auto drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
          <Input
            value={formData.color}
            onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
            placeholder="#RRGGBB"
            pattern="^#[0-9A-Fa-f]{6}$"
            disabled={readOnly}
          />
        </div>
      </form>
    </Modal>
  );
}
