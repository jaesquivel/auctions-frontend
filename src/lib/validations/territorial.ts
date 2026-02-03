import { z } from 'zod';

export const provinceSchema = z.object({
  num: z.number({ required_error: 'validation.required' }).min(1, 'validation.minNumber'),
  code: z.string({ required_error: 'validation.required' }).min(1, 'validation.required').max(10, 'validation.maxLength'),
  name: z.string({ required_error: 'validation.required' }).min(1, 'validation.required').max(100, 'validation.maxLength'),
  nameSearch: z.string().max(100, 'validation.maxLength').optional(),
});

export const cantonSchema = z.object({
  num: z.number({ required_error: 'validation.required' }).min(1, 'validation.minNumber'),
  code: z.string({ required_error: 'validation.required' }).min(1, 'validation.required').max(10, 'validation.maxLength'),
  name: z.string({ required_error: 'validation.required' }).min(1, 'validation.required').max(100, 'validation.maxLength'),
  nameSearch: z.string().max(100, 'validation.maxLength').optional(),
});

export const districtSchema = z.object({
  num: z.number({ required_error: 'validation.required' }).min(1, 'validation.minNumber'),
  code: z.string({ required_error: 'validation.required' }).min(1, 'validation.required').max(10, 'validation.maxLength'),
  name: z.string({ required_error: 'validation.required' }).min(1, 'validation.required').max(100, 'validation.maxLength'),
  nameSearch: z.string().max(100, 'validation.maxLength').optional(),
  area: z.number().min(0, 'validation.minNumber').optional(),
  altitude: z.number().min(0, 'validation.minNumber').optional(),
});

export type ProvinceFormData = z.infer<typeof provinceSchema>;
export type CantonFormData = z.infer<typeof cantonSchema>;
export type DistrictFormData = z.infer<typeof districtSchema>;