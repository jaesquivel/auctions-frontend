'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { RawEdict, RawEdictCreateRequest, RawEdictUpdateRequest } from '@/types';

interface RawEdictFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rawEdict?: RawEdict | null;
  onSubmit: (data: RawEdictCreateRequest | RawEdictUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
}

export function RawEdictForm({ open, onOpenChange, rawEdict, onSubmit, readOnly = false, loading = false }: RawEdictFormProps) {
  const t = useTranslations('extractedEdicts');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    reference: rawEdict?.reference || '',
    creditor: rawEdict?.creditor || '',
    debtor: rawEdict?.debtor || '',
    caseNumber: rawEdict?.caseNumber || '',
    court: rawEdict?.court || '',
    publication: rawEdict?.publication || '',
    publicationCount: rawEdict?.publicationCount || '',
    notes: rawEdict?.notes || '',
    fullText: rawEdict?.fullText || '',
    processed: rawEdict?.processed || false,
  });

  useEffect(() => {
    if (rawEdict) {
      setFormData({
        reference: rawEdict.reference || '',
        creditor: rawEdict.creditor || '',
        debtor: rawEdict.debtor || '',
        caseNumber: rawEdict.caseNumber || '',
        court: rawEdict.court || '',
        publication: rawEdict.publication || '',
        publicationCount: rawEdict.publicationCount || '',
        notes: rawEdict.notes || '',
        fullText: rawEdict.fullText || '',
        processed: rawEdict.processed || false,
      });
    } else {
      setFormData({ reference: '', creditor: '', debtor: '', caseNumber: '', court: '', publication: '', publicationCount: '', notes: '', fullText: '', processed: false });
    }
  }, [rawEdict]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: RawEdictUpdateRequest = {
      reference: formData.reference,
      creditor: formData.creditor,
      debtor: formData.debtor,
      caseNumber: formData.caseNumber,
      court: formData.court,
      publication: formData.publication,
      publicationCount: formData.publicationCount,
      notes: formData.notes,
      fullText: formData.fullText,
      processed: formData.processed,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const isEdit = !!rawEdict;

  const getTitle = () => {
    if (readOnly) return t('viewRawEdict');
    return isEdit ? t('editRawEdict') : t('addRawEdict');
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.reference')}</label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.caseNumber')}</label>
              <Input
                value={formData.caseNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, caseNumber: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>

          {isEdit && rawEdict?.bulletin && (
            <div className="rounded-md border p-3 bg-muted/50 space-y-3">
              <p className="text-sm text-muted-foreground">
                {t('columns.bulletin')}: vol. {rawEdict.bulletin.volume}, {rawEdict.bulletin.year}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('columns.creditor')}</label>
            <Input
              value={formData.creditor}
              onChange={(e) => setFormData((prev) => ({ ...prev, creditor: e.target.value }))}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('columns.debtor')}</label>
            <Input
              value={formData.debtor}
              onChange={(e) => setFormData((prev) => ({ ...prev, debtor: e.target.value }))}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('columns.court')}</label>
            <Input
              value={formData.court}
              onChange={(e) => setFormData((prev) => ({ ...prev, court: e.target.value }))}
              disabled={readOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.publication')}</label>
              <Input
                value={formData.publication}
                onChange={(e) => setFormData((prev) => ({ ...prev, publication: e.target.value }))}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('form.publicationCount')}</label>
              <Input
                value={formData.publicationCount}
                onChange={(e) => setFormData((prev) => ({ ...prev, publicationCount: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('form.notes')}</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('form.fullText')}</label>
            <Textarea
              value={formData.fullText}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullText: e.target.value }))}
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