'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('columns.reference')}</label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('columns.caseNumber')}</label>
              <Input
                value={formData.caseNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, caseNumber: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.court')}</label>
            <Input
              value={formData.court}
              onChange={(e) => setFormData((prev) => ({ ...prev, court: e.target.value }))}
              disabled={readOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('columns.publication')}</label>
              <Input
                type="number"
                value={formData.publication}
                onChange={(e) => setFormData((prev) => ({ ...prev, publication: e.target.value }))}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('form.publicationCount')}</label>
              <Input
                type="number"
                value={formData.publicationCount}
                onChange={(e) => setFormData((prev) => ({ ...prev, publicationCount: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('form.notes')}</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('form.fullText')}</label>
            <Textarea
              value={formData.fullText}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullText: e.target.value }))}
              rows={8}
              disabled={readOnly}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}