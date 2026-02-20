'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StringField } from '@/components/ui/string-field';
import { TextField } from '@/components/ui/text-field';
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
  const fieldMode = readOnly ? 'readonly' : 'edit';

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

  const update = (field: string) => (value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

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
          <StringField mode={fieldMode} label={t('columns.url')} value={formData.url} onChange={update('url')} placeholder="https://..." />

          <div className="grid grid-cols-2 gap-4">
            <StringField mode={fieldMode} label={t('columns.year')} value={formData.year} onChange={update('year')} />
            <StringField mode={fieldMode} label={t('columns.volume')} value={formData.volume} onChange={update('volume')} />
          </div>

          <TextField mode={fieldMode} label={t('columns.document')} value={formData.document} onChange={update('document')} placeholder={t('documentPlaceholder')} rows={8} />

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
