'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cantonSchema, type CantonFormData } from '@/lib/validations/territorial';
import type { Canton, CantonCreateRequest, Province } from '@/types';

interface CantonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canton?: Canton | null;
  province: Province;
  onSubmit: (data: CantonCreateRequest) => Promise<void>;
}

export function CantonForm({ open, onOpenChange, canton, province, onSubmit }: CantonFormProps) {
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
  } = useForm<CantonFormData>({
    resolver: zodResolver(cantonSchema),
    defaultValues: {
      num: canton?.num || 1,
      code: canton?.code || '',
      name: canton?.name || '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        num: canton?.num || 1,
        code: canton?.code || '',
        name: canton?.name || '',
      });
      setServerError(null);
    }
  }, [open, canton, reset]);

  const onFormSubmit = async (data: CantonFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, provinceId: province.id });
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

  const isEdit = !!canton;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editCanton') : t('addCanton')}
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
          <span className="text-sm text-muted-foreground">{t('provinces')}: </span>
          <span className="text-sm font-medium">{province.name}</span>
        </div>

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
              maxLength={4}
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