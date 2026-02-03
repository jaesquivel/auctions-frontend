'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tdProvinceSchema, type TdProvinceFormData } from '@/lib/validations/territorial';
import type { TdProvince, TdProvinceCreateRequest } from '@/types';

interface TdProvinceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tdProvince?: TdProvince | null;
  onSubmit: (data: TdProvinceCreateRequest) => Promise<void>;
}

export function TdProvinceForm({ open, onOpenChange, tdProvince, onSubmit }: TdProvinceFormProps) {
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
  } = useForm<TdProvinceFormData>({
    resolver: zodResolver(tdProvinceSchema),
    defaultValues: {
      num: tdProvince?.num || 1,
      code: tdProvince?.code || '',
      name: tdProvince?.name || '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        num: tdProvince?.num || 1,
        code: tdProvince?.code || '',
        name: tdProvince?.name || '',
      });
      setServerError(null);
    }
  }, [open, tdProvince, reset]);

  const onFormSubmit = async (data: TdProvinceFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(data);
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
    return tValidation(key as 'required' | 'minNumber' | 'maxNumber' | 'maxLength' | 'invalidNumber');
  };

  const isEdit = !!tdProvince;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editProvince') : t('addProvince')}
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('columns.num')}</label>
            <Input
              type="number"
              min={0}
              max={32767}
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
              maxLength={2}
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
            maxLength={2048}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{getErrorMessage(errors.name)}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}