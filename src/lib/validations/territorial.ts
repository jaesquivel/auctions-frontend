import { z } from 'zod';

export const provinceSchema = z.object({
  num: z.number({ error: 'validation.required' }).int('validation.invalidNumber').min(0, 'validation.minNumber').max(32767, 'validation.maxNumber'),
  code: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2, 'validation.maxLength'),
  name: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2048, 'validation.maxLength'),
});

export const cantonSchema = z.object({
  num: z.number({ error: 'validation.required' }).int('validation.invalidNumber').min(0, 'validation.minNumber').max(32767, 'validation.maxNumber'),
  code: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(4, 'validation.maxLength'),
  name: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2048, 'validation.maxLength'),
});

export const districtSchema = z.object({
  num: z.number({ error: 'validation.required' }).int('validation.invalidNumber').min(0, 'validation.minNumber').max(32767, 'validation.maxNumber'),
  code: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(7, 'validation.maxLength'),
  name: z.string({ error: 'validation.required' }).min(1, 'validation.required').max(2048, 'validation.maxLength'),
  area: z.number().min(0, 'validation.minNumber').max(99999999.99, 'validation.maxNumber').optional(),
  altitude: z.number().min(0, 'validation.minNumber').max(9999.99, 'validation.maxNumber').optional(),
});

export type ProvinceFormData = z.infer<typeof provinceSchema>;
export type CantonFormData = z.infer<typeof cantonSchema>;
export type DistrictFormData = z.infer<typeof districtSchema>;