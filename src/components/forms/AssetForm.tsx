'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { StringField } from '@/components/ui/string-field';
import { NumericField } from '@/components/ui/numeric-field';
import { TextField } from '@/components/ui/text-field';
import { DateTimeField } from '@/components/ui/datetime-field';
import type { Asset, AssetListItem, AssetUpdateRequest } from '@/types';

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset | null;
  listItem?: AssetListItem | null;
  onSubmit: (data: AssetUpdateRequest) => void;
  readOnly?: boolean;
  loading?: boolean;
}

export function AssetForm({ open, onOpenChange, asset, listItem, onSubmit, readOnly = false, loading = false }: AssetFormProps) {
  const t = useTranslations('assets');
  const tCommon = useTranslations('common');
  const fieldMode = readOnly ? 'readonly' : 'edit';

  const [formData, setFormData] = useState({
    registration: asset?.registration || '',
    propertyNumber: asset?.propertyNumber || '',
    duplicate: asset?.duplicate || '',
    horizontal: asset?.horizontal || '',
    subRegistration: asset?.subRegistration || '',
    plate: asset?.plate || '',
    type: asset?.type || '',
    currency: (asset?.currency as string) || 'CRC',
    firstAuctionTs: asset?.firstAuctionTs || '',
    firstAuctionBase: asset?.firstAuctionBase?.toString() || '',
    secondAuctionTs: asset?.secondAuctionTs || '',
    secondAuctionBase: asset?.secondAuctionBase?.toString() || '',
    thirdAuctionTs: asset?.thirdAuctionTs || '',
    thirdAuctionBase: asset?.thirdAuctionBase?.toString() || '',
    area: asset?.area?.toString() || '',
    rights: asset?.rights || '',
    liens: asset?.liens || '',
    description: asset?.description || '',
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        registration: asset.registration || '',
        propertyNumber: asset.propertyNumber || '',
        duplicate: asset.duplicate || '',
        horizontal: asset.horizontal || '',
        subRegistration: asset.subRegistration || '',
        plate: asset.plate || '',
        type: asset.type || '',
        currency: (asset.currency as string) || 'CRC',
        firstAuctionTs: asset.firstAuctionTs || '',
        firstAuctionBase: asset.firstAuctionBase?.toString() || '',
        secondAuctionTs: asset.secondAuctionTs || '',
        secondAuctionBase: asset.secondAuctionBase?.toString() || '',
        thirdAuctionTs: asset.thirdAuctionTs || '',
        thirdAuctionBase: asset.thirdAuctionBase?.toString() || '',
        area: asset.area?.toString() || '',
        rights: asset.rights || '',
        liens: asset.liens || '',
        description: asset.description || '',
      });
    } else {
      setFormData({
        registration: '', propertyNumber: '', duplicate: '', horizontal: '',
        subRegistration: '', plate: '', type: '', currency: 'CRC',
        firstAuctionTs: '', firstAuctionBase: '', secondAuctionTs: '', secondAuctionBase: '',
        thirdAuctionTs: '', thirdAuctionBase: '', area: '', rights: '', liens: '', description: '',
      });
    }
  }, [asset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: AssetUpdateRequest = {
      registration: formData.registration || undefined,
      propertyNumber: formData.propertyNumber || undefined,
      duplicate: formData.duplicate || undefined,
      horizontal: formData.horizontal || undefined,
      subRegistration: formData.subRegistration || undefined,
      plate: formData.plate || undefined,
      type: formData.type || undefined,
      currency: (formData.currency || undefined) as AssetUpdateRequest['currency'],
      firstAuctionTs: formData.firstAuctionTs || undefined,
      firstAuctionBase: formData.firstAuctionBase ? Number(formData.firstAuctionBase) : undefined,
      secondAuctionTs: formData.secondAuctionTs || undefined,
      secondAuctionBase: formData.secondAuctionBase ? Number(formData.secondAuctionBase) : undefined,
      thirdAuctionTs: formData.thirdAuctionTs || undefined,
      thirdAuctionBase: formData.thirdAuctionBase ? Number(formData.thirdAuctionBase) : undefined,
      area: formData.area ? Number(formData.area) : undefined,
      rights: formData.rights || undefined,
      liens: formData.liens || undefined,
      description: formData.description || undefined,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const isEdit = !!asset;
  const update = (field: string) => (value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const getTitle = () => {
    if (readOnly) return t('viewAsset');
    return isEdit ? t('editAsset') : t('addAsset');
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
          {isEdit && listItem && (
            <fieldset className="space-y-3">
              {listItem.edict?.creditor && (
                <StringField mode="readonly" label={t('form.creditor')} value={listItem.edict.creditor.name} />
              )}
              {listItem.edict?.debtor && (
                <StringField mode="readonly" label={t('form.debtor')} value={listItem.edict.debtor.name} />
              )}
              {listItem.edict?.court && (
                <StringField mode="readonly" label={t('form.court')} value={listItem.edict.court} />
              )}
              {listItem.tdProvince && listItem.tdCanton && listItem.tdDistrict && (
                <StringField mode="readonly" label={t('form.tdLocation')} value={listItem.tdProvince?.name + ", " + listItem.tdCanton?.name + ", " + listItem.tdDistrict?.name} />
              )}
            </fieldset>
          )}

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.registrationInfo')}</legend>
            <div className="grid grid-cols-2 gap-4">
              <StringField mode={fieldMode} label={t('columns.registration')} value={formData.registration} onChange={update('registration')} />
              <StringField mode={fieldMode} label={t('columns.propertyNumber')} value={formData.propertyNumber} onChange={update('propertyNumber')} />
            </div>
            <StringField mode={fieldMode} label={t('columns.type')} value={formData.type} onChange={update('type')} />
            <div className="grid grid-cols-2 gap-4">
              <StringField mode={fieldMode} label={t('form.duplicate')} value={formData.duplicate} onChange={update('duplicate')} />
              <StringField mode={fieldMode} label={t('form.horizontal')} value={formData.horizontal} onChange={update('horizontal')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StringField mode={fieldMode} label={t('form.subRegistration')} value={formData.subRegistration} onChange={update('subRegistration')} />
              <StringField mode={fieldMode} label={t('form.plate')} value={formData.plate} onChange={update('plate')} />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.auctionInfo')}</legend>
            <StringField mode={fieldMode} label={t('columns.currency')} value={formData.currency} onChange={update('currency')} />
            <div className="grid grid-cols-2 gap-4">
              <DateTimeField mode={fieldMode} label={t('form.firstAuctionDate')} value={formData.firstAuctionTs} onChange={update('firstAuctionTs')} />
              <NumericField mode={fieldMode} label={t('form.firstAuctionBase')} value={formData.firstAuctionBase} onChange={update('firstAuctionBase')} decimals={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateTimeField mode={fieldMode} label={t('form.secondAuctionDate')} value={formData.secondAuctionTs} onChange={update('secondAuctionTs')} />
              <NumericField mode={fieldMode} label={t('form.secondAuctionBase')} value={formData.secondAuctionBase} onChange={update('secondAuctionBase')} decimals={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateTimeField mode={fieldMode} label={t('form.thirdAuctionDate')} value={formData.thirdAuctionTs} onChange={update('thirdAuctionTs')} />
              <NumericField mode={fieldMode} label={t('form.thirdAuctionBase')} value={formData.thirdAuctionBase} onChange={update('thirdAuctionBase')} decimals={2} />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.details')}</legend>
            <div className="grid grid-cols-2 gap-4">
              <NumericField mode={fieldMode} label={t('form.area')} value={formData.area} onChange={update('area')} decimals={2} />
              <StringField mode={fieldMode} label={t('form.rights')} value={formData.rights} onChange={update('rights')} />
            </div>
            <TextField mode={fieldMode} label={t('form.liens')} value={formData.liens} onChange={update('liens')} rows={3} />
            <TextField mode={fieldMode} label={t('form.description')} value={formData.description} onChange={update('description')} rows={4} />
          </fieldset>
        </form>
      )}
    </Modal>
  );
}
