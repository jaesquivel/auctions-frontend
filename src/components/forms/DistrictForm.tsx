'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { districtSchema, type DistrictFormData } from '@/lib/validations/territorial';
import type { District, DistrictCreateRequest, Canton } from '@/types';

interface DistrictFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district?: District | null;
  canton: Canton;
  onSubmit: (data: DistrictCreateRequest) => Promise<void>;
}

export function DistrictForm({ open, onOpenChange, district, canton, onSubmit }: DistrictFormProps) {
  const t = useTranslations('territorial');
  const tCommon = useTranslations('common');
  const tValidation = useTranslations('validation');

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistrictFormData>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      num: district?.num || 1,
      code: district?.code || '',
      name: district?.name || '',
      nameSearch: district?.nameSearch || '',
      area: district?.area || undefined,
      altitude: district?.altitude || undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        num: district?.num || 1,
        code: district?.code || '',
        name: district?.name || '',
        nameSearch: district?.nameSearch || '',
        area: district?.area || undefined,
        altitude: district?.altitude || undefined,
      });
      setServerError(null);
    }
  }, [open, district, reset]);

  const onFormSubmit = async (data: DistrictFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, cantonId: canton.id });
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (error: { message?: string } | undefined) => {
    if (!error?.message) return null;
    const key = error.message.replace('validation.', '');
    return tValidation(key as 'required' | 'minNumber' | 'maxLength' | 'invalidNumber');
  };

  const isEdit = !!district;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editDistrict') : t('addDistrict')}
      size="sm"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} disabled={isSubmitting}>
            {isSubmitting ? tCommon('loading') : tCommon('save')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {serverError}
          </div>
        )}

        <div className="p-3 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">{t('cantons')}: </span>
          <span className="text-sm font-medium">{canton.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.num')}</label>
            <Input
              type="number"
              {...register('num', { valueAsNumber: true })}
              className={errors.num ? 'border-destructive' : ''}
            />
            {errors.num && (
              <p className="text-xs text-destructive">{getErrorMessage(errors.num)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.code')}</label>
            <Input
              {...register('code')}
              maxLength={10}
              className={errors.code ? 'border-destructive' : ''}
            />
            {errors.code && (
              <p className="text-xs text-destructive">{getErrorMessage(errors.code)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.name')}</label>
          <Input
            {...register('name')}
            maxLength={100}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{getErrorMessage(errors.name)}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('columns.nameSearch')}</label>
          <Input
            {...register('nameSearch')}
            maxLength={100}
            className={errors.nameSearch ? 'border-destructive' : ''}
          />
          {errors.nameSearch && (
            <p className="text-xs text-destructive">{getErrorMessage(errors.nameSearch)}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.area')}</label>
            <Input
              type="number"
              step="0.01"
              {...register('area', { valueAsNumber: true })}
              className={errors.area ? 'border-destructive' : ''}
            />
            {errors.area && (
              <p className="text-xs text-destructive">{getErrorMessage(errors.area)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.altitude')}</label>
            <Input
              type="number"
              {...register('altitude', { valueAsNumber: true })}
              className={errors.altitude ? 'border-destructive' : ''}
            />
            {errors.altitude && (
              <p className="text-xs text-destructive">{getErrorMessage(errors.altitude)}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}