'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { RawAsset, RawAssetUpdateRequest } from '@/types';

interface RawAssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rawAsset?: RawAsset | null;
  onSubmit: (data: RawAssetUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
  edictFullText?: string | null;
}

export function RawAssetForm({ open, onOpenChange, rawAsset, onSubmit, readOnly = false, loading = false, edictFullText }: RawAssetFormProps) {
  const t = useTranslations('extractedAssets');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    type: rawAsset?.type || '',
    registration: rawAsset?.registration || '',
    plate: rawAsset?.plate || '',
    currency: rawAsset?.currency || '',
    firstAuctionDate: rawAsset?.firstAuctionDate || '',
    firstAuctionTime: rawAsset?.firstAuctionTime || '',
    firstAuctionBase: rawAsset?.firstAuctionBase || '',
    secondAuctionDate: rawAsset?.secondAuctionDate || '',
    secondAuctionTime: rawAsset?.secondAuctionTime || '',
    secondAuctionBase: rawAsset?.secondAuctionBase || '',
    thirdAuctionDate: rawAsset?.thirdAuctionDate || '',
    thirdAuctionTime: rawAsset?.thirdAuctionTime || '',
    thirdAuctionBase: rawAsset?.thirdAuctionBase || '',
    tdProvince: rawAsset?.tdProvince || '',
    tdCanton: rawAsset?.tdCanton || '',
    tdDistrict: rawAsset?.tdDistrict || '',
    area: rawAsset?.area || '',
    processed: rawAsset?.processed || false,
  });

  useEffect(() => {
    if (rawAsset) {
      setFormData({
        type: rawAsset.type || '',
        registration: rawAsset.registration || '',
        plate: rawAsset.plate || '',
        currency: rawAsset.currency || '',
        firstAuctionDate: rawAsset.firstAuctionDate || '',
        firstAuctionTime: rawAsset.firstAuctionTime || '',
        firstAuctionBase: rawAsset.firstAuctionBase || '',
        secondAuctionDate: rawAsset.secondAuctionDate || '',
        secondAuctionTime: rawAsset.secondAuctionTime || '',
        secondAuctionBase: rawAsset.secondAuctionBase || '',
        thirdAuctionDate: rawAsset.thirdAuctionDate || '',
        thirdAuctionTime: rawAsset.thirdAuctionTime || '',
        thirdAuctionBase: rawAsset.thirdAuctionBase || '',
        tdProvince: rawAsset.tdProvince || '',
        tdCanton: rawAsset.tdCanton || '',
        tdDistrict: rawAsset.tdDistrict || '',
        area: rawAsset.area || '',
        processed: rawAsset.processed || false,
      });
    } else {
      setFormData({
        type: '', registration: '', plate: '', currency: '',
        firstAuctionDate: '', firstAuctionTime: '', firstAuctionBase: '',
        secondAuctionDate: '', secondAuctionTime: '', secondAuctionBase: '',
        thirdAuctionDate: '', thirdAuctionTime: '', thirdAuctionBase: '',
        tdProvince: '', tdCanton: '', tdDistrict: '', area: '',
        processed: false,
      });
    }
  }, [rawAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: RawAssetUpdateRequest = {
      type: formData.type,
      registration: formData.registration,
      plate: formData.plate,
      currency: formData.currency,
      firstAuctionDate: formData.firstAuctionDate,
      firstAuctionTime: formData.firstAuctionTime,
      firstAuctionBase: formData.firstAuctionBase,
      secondAuctionDate: formData.secondAuctionDate,
      secondAuctionTime: formData.secondAuctionTime,
      secondAuctionBase: formData.secondAuctionBase,
      thirdAuctionDate: formData.thirdAuctionDate,
      thirdAuctionTime: formData.thirdAuctionTime,
      thirdAuctionBase: formData.thirdAuctionBase,
      tdProvince: formData.tdProvince,
      tdCanton: formData.tdCanton,
      tdDistrict: formData.tdDistrict,
      area: formData.area,
      processed: formData.processed,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const getTitle = () => {
    if (readOnly) return t('viewRawAsset');
    return t('editRawAsset');
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
          {/* Edict info (read-only) */}
          {rawAsset?.rawEdict && (
            <div className="rounded-md border p-3 bg-muted/50 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{t('columns.edict')}</p>
              <p className="text-sm">{t('columns.caseNumber')}: {rawAsset.rawEdict.caseNumber || '-'}</p>
              <p className="text-sm">{t('columns.reference')}: {rawAsset.rawEdict.reference || '-'}</p>
            </div>
          )}

          {/* Edict full text (read-only) */}
          {edictFullText && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('form.edictFullText')}</label>
              <Textarea
                value={edictFullText}
                rows={8}
                readOnly
                className="cursor-default"
              />
            </div>
          )}

          {/* Type & identifiers */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.type')}</label>
              <Input
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.registration')}</label>
              <Input
                value={formData.registration}
                onChange={(e) => setFormData((prev) => ({ ...prev, registration: e.target.value }))}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.plate')}</label>
              <Input
                value={formData.plate}
                onChange={(e) => setFormData((prev) => ({ ...prev, plate: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>

          {/* Currency */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.currency')}</label>
              <Input
                value={formData.currency}
                onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('columns.area')}</label>
              <Input
                value={formData.area}
                onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>

          {/* First auction */}
          <fieldset className="rounded-md border p-3 space-y-3">
            <legend className="text-sm font-medium px-1">{t('form.firstAuction')}</legend>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.date')}</label>
                <Input value={formData.firstAuctionDate} onChange={(e) => setFormData((prev) => ({ ...prev, firstAuctionDate: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.time')}</label>
                <Input value={formData.firstAuctionTime} onChange={(e) => setFormData((prev) => ({ ...prev, firstAuctionTime: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.base')}</label>
                <Input value={formData.firstAuctionBase} onChange={(e) => setFormData((prev) => ({ ...prev, firstAuctionBase: e.target.value }))} disabled={readOnly} />
              </div>
            </div>
          </fieldset>

          {/* Second auction */}
          <fieldset className="rounded-md border p-3 space-y-3">
            <legend className="text-sm font-medium px-1">{t('form.secondAuction')}</legend>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.date')}</label>
                <Input value={formData.secondAuctionDate} onChange={(e) => setFormData((prev) => ({ ...prev, secondAuctionDate: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.time')}</label>
                <Input value={formData.secondAuctionTime} onChange={(e) => setFormData((prev) => ({ ...prev, secondAuctionTime: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.base')}</label>
                <Input value={formData.secondAuctionBase} onChange={(e) => setFormData((prev) => ({ ...prev, secondAuctionBase: e.target.value }))} disabled={readOnly} />
              </div>
            </div>
          </fieldset>

          {/* Third auction */}
          <fieldset className="rounded-md border p-3 space-y-3">
            <legend className="text-sm font-medium px-1">{t('form.thirdAuction')}</legend>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.date')}</label>
                <Input value={formData.thirdAuctionDate} onChange={(e) => setFormData((prev) => ({ ...prev, thirdAuctionDate: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.time')}</label>
                <Input value={formData.thirdAuctionTime} onChange={(e) => setFormData((prev) => ({ ...prev, thirdAuctionTime: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('form.base')}</label>
                <Input value={formData.thirdAuctionBase} onChange={(e) => setFormData((prev) => ({ ...prev, thirdAuctionBase: e.target.value }))} disabled={readOnly} />
              </div>
            </div>
          </fieldset>

          {/* Location */}
          <fieldset className="rounded-md border p-3 space-y-3">
            <legend className="text-sm font-medium px-1">{t('form.location')}</legend>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('columns.province')}</label>
                <Input value={formData.tdProvince} onChange={(e) => setFormData((prev) => ({ ...prev, tdProvince: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('columns.canton')}</label>
                <Input value={formData.tdCanton} onChange={(e) => setFormData((prev) => ({ ...prev, tdCanton: e.target.value }))} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('columns.district')}</label>
                <Input value={formData.tdDistrict} onChange={(e) => setFormData((prev) => ({ ...prev, tdDistrict: e.target.value }))} disabled={readOnly} />
              </div>
            </div>
          </fieldset>

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