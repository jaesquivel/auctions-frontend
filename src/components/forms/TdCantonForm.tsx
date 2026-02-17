'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumericInput } from '@/components/ui/numeric-input';
import { tdCantonSchema, type TdCantonFormData } from '@/lib/validations/territorial';
import type { TdCanton, TdCantonCreateRequest, TdProvince } from '@/types';

interface TdCantonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tdCanton?: TdCanton | null;
  tdProvince: TdProvince;
  onSubmit: (data: TdCantonCreateRequest) => Promise<void>;
  readOnly?: boolean;
}

export function TdCantonForm({ open, onOpenChange, tdCanton, tdProvince, onSubmit, readOnly = false }: TdCantonFormProps) {
  const t = useTranslations('territorial');
  const tCommon = useTranslations('common');
  const tValidation = useTranslations('validation');

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TdCantonFormData>({
    resolver: zodResolver(tdCantonSchema),
    defaultValues: {
      num: tdCanton?.num || 1,
      code: tdCanton?.code || '',
      name: tdCanton?.name || '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        num: tdCanton?.num || 1,
        code: tdCanton?.code || '',
        name: tdCanton?.name || '',
      });
      setServerError(null);
    }
  }, [open, tdCanton, reset]);

  const onFormSubmit = async (data: TdCantonFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, tdProvinceId: tdProvince.id });
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

  const isEdit = !!tdCanton;

  const getTitle = () => {
    if (readOnly) return t('viewCanton');
    return isEdit ? t('editCanton') : t('addCanton');
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="sm"
      footer={
        readOnly ? (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon('close')}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleSubmit(onFormSubmit)} disabled={isSubmitting}>
              {isSubmitting ? tCommon('loading') : tCommon('save')}
            </Button>
          </div>
        )
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
          <span className="block text-sm font-medium">{tdProvince.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('columns.num')}</label>
            <Controller
              name="num"
              control={control}
              render={({ field }) => (
                <NumericInput
                  value={field.value?.toString() || ''}
                  onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                  className={errors.num ? 'border-destructive' : ''}
                  disabled={readOnly}
                />
              )}
            />
            {errors.num && (
              <p className="text-xs text-destructive">{getErrorMessage(errors.num)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('columns.code')}</label>
            <Input
              {...register('code')}
              maxLength={4}
              className={errors.code ? 'border-destructive' : ''}
              disabled={readOnly}
            />
            {errors.code && (
              <p className="text-xs text-destructive">{getErrorMessage(errors.code)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('columns.name')}</label>
          <Input
            {...register('name')}
            maxLength={2048}
            className={errors.name ? 'border-destructive' : ''}
            disabled={readOnly}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{getErrorMessage(errors.name)}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}