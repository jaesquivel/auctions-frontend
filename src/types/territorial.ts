// Territorial Division types

export interface TdProvince {
  id: string;
  code: string;
  num: number;
  name: string;
  nameSearch: string;
  createdAt: string;
}

export interface TdProvinceSummary {
  num: number;
  name: string;
}

export interface TdCanton {
  id: string;
  code: string;
  num: number;
  name: string;
  nameSearch: string;
  tdProvinceId: string;
  tdProvince?: TdProvinceSummary;
  createdAt: string;
}

export interface TdCantonSummary {
  num: number;
  name: string;
}

export interface TdDistrict {
  id: string;
  code: string;
  num: number;
  name: string;
  nameSearch: string;
  area: number | null;
  altitude: number | null;
  tdCantonId: string;
  tdCanton?: TdCantonSummary;
  createdAt: string;
}

export interface TdDistrictSummary {
  num: number;
  name: string;
}

export interface TdProvinceCreateRequest {
  code: string;
  num: number;
  name: string;
}

export interface TdCantonCreateRequest {
  code: string;
  num: number;
  name: string;
  tdProvinceId: string;
}

export interface TdDistrictCreateRequest {
  code: string;
  num: number;
  name: string;
  tdCantonId: string;
  area?: number;
  altitude?: number;
}