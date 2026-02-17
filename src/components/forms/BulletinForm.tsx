'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumericInput } from '@/components/ui/numeric-input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { Bulletin, BulletinCreateRequest, BulletinUpdateRequest } from '@/types';

interface BulletinFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bulletin?: Bulletin | null;
  onSubmit: (data: BulletinCreateRequest | BulletinUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
}

export function BulletinForm({ open, onOpenChange, bulletin, onSubmit, readOnly = false, loading = false }: BulletinFormProps) {
  const t = useTranslations('bulletins');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    url: bulletin?.url || '',
    year: bulletin?.year?.toString() || '',
    volume: bulletin?.volume?.toString() || '',
    document: bulletin?.document || '',
    processed: bulletin?.processed || false,
  });

  useEffect(() => {
    if (bulletin) {
      setFormData({
        url: bulletin.url || '',
        year: bulletin.year?.toString() || '',
        volume: bulletin.volume?.toString() || '',
        document: bulletin.document || '',
        processed: bulletin.processed || false,
      });
    } else {
      setFormData({ url: '', year: '', volume: '', document: '', processed: false });
    }
  }, [bulletin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      url: formData.url,
      year: formData.year ? parseInt(formData.year, 10) : undefined,
      volume: formData.volume ? parseInt(formData.volume, 10) : undefined,
      document: formData.document || undefined,
      processed: formData.processed,
    });
    onOpenChange(false);
  };

  const isEdit = !!bulletin;

  const getTitle = () => {
    if (readOnly) return t('viewBulletin');
    return isEdit ? t('editBulletin') : t('addBulletin');
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="md"
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
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('columns.url')}</label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
              required
              disabled={readOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.year')}</label>
              <NumericInput
                value={formData.year}
                onChange={(v) => setFormData((prev) => ({ ...prev, year: v }))}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.volume')}</label>
              <NumericInput
                value={formData.volume}
                onChange={(v) => setFormData((prev) => ({ ...prev, volume: v }))}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('columns.document')}</label>
            <Textarea
              value={formData.document}
              onChange={(e) => setFormData((prev) => ({ ...prev, document: e.target.value }))}
              placeholder={t('documentPlaceholder')}
              rows={8}
              disabled={readOnly}
            />
          </div>

          <div className="pt-2">
            <Checkbox
              checked={formData.processed}
              onChange={(e) => setFormData((prev) => ({ ...prev, processed: e.target.checked }))}
              label={t('columns.processed')}
              disabled={readOnly}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}