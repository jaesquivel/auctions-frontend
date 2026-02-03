import { z } from 'zod';

export const tdProvinceSchema = z.object({
  num: z.number({ error: 'validation.required' }).int('validation.invalidNumber').min(0, 'validation.minNumber').max(32767, 'validation.maxNumber'),
  code: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2, 'validation.maxLength'),
  name: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2048, 'validation.maxLength'),
});

export const tdCantonSchema = z.object({
  num: z.number({ error: 'validation.required' }).int('validation.invalidNumber').min(0, 'validation.minNumber').max(32767, 'validation.maxNumber'),
  code: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(4, 'validation.maxLength'),
  name: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2048, 'validation.maxLength'),
});

export const tdDistrictSchema = z.object({
  num: z.number({ error: 'validation.required' }).int('validation.invalidNumber').min(0, 'validation.minNumber').max(32767, 'validation.maxNumber'),
  code: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(7, 'validation.maxLength'),
  name: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2048, 'validation.maxLength'),
  area: z.number().min(0, 'validation.minNumber').max(99999999.99, 'validation.maxNumber').optional(),
  altitude: z.number().min(0, 'validation.minNumber').max(9999.99, 'validation.maxNumber').optional(),
});

export type TdProvinceFormData = z.infer<typeof tdProvinceSchema>;
export type TdCantonFormData = z.infer<typeof tdCantonSchema>;
export type TdDistrictFormData = z.infer<typeof tdDistrictSchema>;