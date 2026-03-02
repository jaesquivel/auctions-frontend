'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { StringField } from '@/components/ui/string-field';
import { TextField } from '@/components/ui/text-field';
import type { Edict, EdictListItem, EdictUpdateRequest } from '@/types';

interface EdictFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edict?: Edict | null;
  listItem?: EdictListItem | null;
  onSubmit: (data: EdictUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
}

export function EdictForm({ open, onOpenChange, edict, listItem, onSubmit, readOnly = false, loading = false }: EdictFormProps) {
  const t = useTranslations('edicts');
  const tCommon = useTranslations('common');
  const fieldMode = readOnly ? 'readonly' : 'edit';

  const [formData, setFormData] = useState({
    reference: edict?.reference || '',
    caseNumber: edict?.caseNumber || '',
    court: edict?.court || '',
    publication: edict?.publication?.toString() || '',
    publicationCount: edict?.publicationCount?.toString() || '',
    notes: edict?.notes || '',
    fullText: edict?.fullText || '',
  });

  useEffect(() => {
    if (edict) {
      setFormData({
        reference: edict.reference || '',
        caseNumber: edict.caseNumber || '',
        court: edict.court || '',
        publication: edict.publication?.toString() || '',
        publicationCount: edict.publicationCount?.toString() || '',
        notes: edict.notes || '',
        fullText: edict.fullText || '',
      });
    } else {
      setFormData({ reference: '', caseNumber: '', court: '', publication: '', publicationCount: '', notes: '', fullText: '' });
    }
  }, [edict]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: EdictUpdateRequest = {
      reference: formData.reference || undefined,
      caseNumber: formData.caseNumber || undefined,
      court: formData.court || undefined,
      publication: formData.publication ? Number(formData.publication) : undefined,
      publicationCount: formData.publicationCount ? Number(formData.publicationCount) : undefined,
      notes: formData.notes || undefined,
      fullText: formData.fullText || undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const isEdit = !!edict;
  const update = (field: string) => (value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const getTitle = () => {
    if (readOnly) return t('viewEdict');
    return isEdit ? t('editEdict') : t('addEdict');
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
          {isEdit && (
            <div className="rounded-md border p-3 bg-muted/50 space-y-1 text-sm text-muted-foreground">
              {edict?.creditor && (
                <p><span className="font-medium">{t('form.creditor')}:</span> {edict.creditor.name}</p>
              )}
              {edict?.debtor && (
                <p><span className="font-medium">{t('form.debtor')}:</span> {edict.debtor.name}</p>
              )}
              {edict?.judiciaryOffice && (
                <p><span className="font-medium">{t('form.judiciaryOffice')}:</span> {edict.judiciaryOffice.officeName}</p>
              )}
              {listItem?.bulletin && (
                <p><span className="font-medium">{t('columns.bulletin')}:</span> vol. {listItem.bulletin.volume}, {listItem.bulletin.year}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <StringField mode={fieldMode} label={t('columns.reference')} value={formData.reference} onChange={update('reference')} />
            <StringField mode={fieldMode} label={t('columns.caseNumber')} value={formData.caseNumber} onChange={update('caseNumber')} />
          </div>

          <StringField mode={fieldMode} label={t('columns.court')} value={formData.court} onChange={update('court')} />

          <div className="grid grid-cols-2 gap-4">
            <StringField mode={fieldMode} label={t('columns.publication')} value={formData.publication} onChange={update('publication')} />
            <StringField mode={fieldMode} label={t('form.publicationCount')} value={formData.publicationCount} onChange={update('publicationCount')} />
          </div>

          <TextField mode={fieldMode} label={t('form.notes')} value={formData.notes} onChange={update('notes')} rows={3} />
          <TextField mode={fieldMode} label={t('form.fullText')} value={formData.fullText} onChange={update('fullText')} rows={8} />
        </form>
      )}
    </Modal>
  );
}
