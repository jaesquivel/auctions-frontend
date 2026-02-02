// Geographic/Territorial Division types

export interface Province {
  id: string;
  code: string;
  num: number;
  name: string;
  nameSearch: string;
  createdAt: string;
}

export interface ProvinceSummary {
  num: number;
  name: string;
}

export interface Canton {
  id: string;
  code: string;
  num: number;
  name: string;
  nameSearch: string;
  provinceId: string;
  province?: ProvinceSummary;
  createdAt: string;
}

export interface CantonSummary {
  num: number;
  name: string;
}

export interface District {
  id: string;
  code: string;
  num: number;
  name: string;
  nameSearch: string;
  area: number | null;
  altitude: number | null;
  cantonId: string;
  canton?: CantonSummary;
  createdAt: string;
}

export interface DistrictSummary {
  num: number;
  name: string;
}

export interface ProvinceCreateRequest {
  code: string;
  num: number;
  name: string;
  nameSearch?: string;
}

export interface CantonCreateRequest {
  code: string;
  num: number;
  name: string;
  nameSearch?: string;
  provinceId: string;
}

export interface DistrictCreateRequest {
  code: string;
  num: number;
  name: string;
  nameSearch?: string;
  cantonId: string;
  area?: number;
  altitude?: number;
}