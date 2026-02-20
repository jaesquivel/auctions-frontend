'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { NumericField } from '@/components/ui/numeric-field';
import { StringField } from '@/components/ui/string-field';
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
  const fieldMode = readOnly ? 'readonly' : 'edit';

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
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
          <div>
            <Controller
              name="num"
              control={control}
              render={({ field }) => (
                <NumericField
                  mode={fieldMode}
                  label={t('columns.num')}
                  value={field.value?.toString() || ''}
                  onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                  decimals={0}
                  className={errors.num ? 'border-destructive' : ''}
                />
              )}
            />
            {errors.num && (
              <p className="text-xs text-destructive mt-1">{getErrorMessage(errors.num)}</p>
            )}
          </div>

          <div>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <StringField
                  mode={fieldMode}
                  label={t('columns.code')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  className={errors.code ? 'border-destructive' : ''}
                />
              )}
            />
            {errors.code && (
              <p className="text-xs text-destructive mt-1">{getErrorMessage(errors.code)}</p>
            )}
          </div>
        </div>

        <div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <StringField
                mode={fieldMode}
                label={t('columns.name')}
                value={field.value || ''}
                onChange={field.onChange}
                className={errors.name ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{getErrorMessage(errors.name)}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
