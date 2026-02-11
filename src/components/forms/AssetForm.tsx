'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

  const [formData, setFormData] = useState({
    registration: asset?.registration || '',
    propertyNumber: asset?.propertyNumber || '',
    duplicate: asset?.duplicate || '',
    horizontal: asset?.horizontal || '',
    subRegistration: asset?.subRegistration || '',
    plate: asset?.plate || '',
    type: asset?.type || '',
    currency: asset?.currency || 'CRC',
    firstAuctionTs: asset?.firstAuctionTs?.slice(0, 16) || '',
    firstAuctionBase: asset?.firstAuctionBase?.toString() || '',
    secondAuctionTs: asset?.secondAuctionTs?.slice(0, 16) || '',
    secondAuctionBase: asset?.secondAuctionBase?.toString() || '',
    thirdAuctionTs: asset?.thirdAuctionTs?.slice(0, 16) || '',
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
        currency: asset.currency || 'CRC',
        firstAuctionTs: asset.firstAuctionTs?.slice(0, 16) || '',
        firstAuctionBase: asset.firstAuctionBase?.toString() || '',
        secondAuctionTs: asset.secondAuctionTs?.slice(0, 16) || '',
        secondAuctionBase: asset.secondAuctionBase?.toString() || '',
        thirdAuctionTs: asset.thirdAuctionTs?.slice(0, 16) || '',
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
      currency: formData.currency || undefined,
      firstAuctionTs: formData.firstAuctionTs ? `${formData.firstAuctionTs}:00Z` : undefined,
      firstAuctionBase: formData.firstAuctionBase ? Number(formData.firstAuctionBase) : undefined,
      secondAuctionTs: formData.secondAuctionTs ? `${formData.secondAuctionTs}:00Z` : undefined,
      secondAuctionBase: formData.secondAuctionBase ? Number(formData.secondAuctionBase) : undefined,
      thirdAuctionTs: formData.thirdAuctionTs ? `${formData.thirdAuctionTs}:00Z` : undefined,
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
            <div className="rounded-md border p-3 bg-muted/50 space-y-1 text-sm text-muted-foreground">
              {listItem.edict?.creditor && (
                <p><span className="font-medium">{t('form.creditor')}:</span> {listItem.edict.creditor.name}</p>
              )}
              {listItem.edict?.debtor && (
                <p><span className="font-medium">{t('form.debtor')}:</span> {listItem.edict.debtor.name}</p>
              )}
              {listItem.edict?.court && (
                <p><span className="font-medium">{t('form.court')}:</span> {listItem.edict.court}</p>
              )}
              {listItem.tdProvince && (
                <p><span className="font-medium">{t('form.province')}:</span> {listItem.tdProvince?.name}</p>
              )}
              {listItem.tdCanton && (
                <p><span className="font-medium">{t('form.cantone')}:</span> {listItem.tdCanton?.name}</p>
              )}
              {listItem.tdDistrict && (
                <p><span className="font-medium">{t('form.district')}:</span> {listItem.tdDistrict?.name}</p>
              )}
            </div>
          )}

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.registrationInfo')}</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('columns.registration')}</label>
                <Input
                  value={formData.registration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, registration: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('columns.propertyNumber')}</label>
                <Input
                  value={formData.propertyNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, propertyNumber: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('columns.type')}</label>
              <Input
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                disabled={readOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.duplicate')}</label>
                <Input
                  value={formData.duplicate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duplicate: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.horizontal')}</label>
                <Input
                  value={formData.horizontal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, horizontal: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.subRegistration')}</label>
                <Input
                  value={formData.subRegistration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subRegistration: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.plate')}</label>
                <Input
                  value={formData.plate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, plate: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.auctionInfo')}</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('columns.currency')}</label>
              <Input
                value={formData.currency}
                onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                disabled={readOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.firstAuctionDate')}</label>
                <Input
                  type="datetime-local"
                  value={formData.firstAuctionTs}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstAuctionTs: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.firstAuctionBase')}</label>
                <Input
                  type="number"
                  value={formData.firstAuctionBase}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstAuctionBase: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.secondAuctionDate')}</label>
                <Input
                  type="datetime-local"
                  value={formData.secondAuctionTs}
                  onChange={(e) => setFormData((prev) => ({ ...prev, secondAuctionTs: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.secondAuctionBase')}</label>
                <Input
                  type="number"
                  value={formData.secondAuctionBase}
                  onChange={(e) => setFormData((prev) => ({ ...prev, secondAuctionBase: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.thirdAuctionDate')}</label>
                <Input
                  type="datetime-local"
                  value={formData.thirdAuctionTs}
                  onChange={(e) => setFormData((prev) => ({ ...prev, thirdAuctionTs: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.thirdAuctionBase')}</label>
                <Input
                  type="number"
                  value={formData.thirdAuctionBase}
                  onChange={(e) => setFormData((prev) => ({ ...prev, thirdAuctionBase: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-muted-foreground">{t('form.details')}</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.area')}</label>
                <Input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.rights')}</label>
                <Input
                  value={formData.rights}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rights: e.target.value }))}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('form.liens')}</label>
              <Textarea
                value={formData.liens}
                onChange={(e) => setFormData((prev) => ({ ...prev, liens: e.target.value }))}
                rows={3}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('form.description')}</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                disabled={readOnly}
              />
            </div>
          </fieldset>
        </form>
      )}
    </Modal>
  );
}