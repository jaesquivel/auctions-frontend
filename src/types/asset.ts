// Asset types
import type { TdProvinceSummary, TdCantonSummary, TdDistrictSummary } from './territorial';
import type { Currency } from './common';

export interface Asset {
  id: string;
  // Auction information
  firstAuctionTs: string | null;
  firstAuctionBase: number | null;
  secondAuctionTs: string | null;
  secondAuctionBase: number | null;
  thirdAuctionTs: string | null;
  thirdAuctionBase: number | null;
  currency: Currency;
  // Property registration
  liens: string | null;
  registration: string | null;
  propertyNumber: string | null;
  duplicate: string | null;
  horizontal: string | null;
  subRegistration: string | null;
  plate: string | null;
  type: string | null;
  // Territorial Division
  tdProvince: TdProvinceSummary | null;
  tdCanton: TdCantonSummary | null;
  tdDistrict: TdDistrictSummary | null;
  // Details
  area: number | null;
  description: string | null;
  rights: string | null;
  edictId: string;
  createdAt: string;
}

export interface AssetSummary {
  id: string;
  firstAuctionTs: string | null;
  firstAuctionBase: number | null;
  currency: Currency;
  propertyNumber: string | null;
  registration: string | null;
  duplicate: string | null;
  horizontal: string | null;
  area: number | null;
  rights: string | null;
  tdProvince: TdProvinceSummary | null;
  tdCanton: TdCantonSummary | null;
  tdDistrict: TdDistrictSummary | null;
}

export interface AssetCreateRequest {
  edictId: string;
  firstAuctionTs?: string;
  firstAuctionBase?: number;
  secondAuctionTs?: string;
  secondAuctionBase?: number;
  thirdAuctionTs?: string;
  thirdAuctionBase?: number;
  currency?: Currency;
  liens?: string;
  registration?: string;
  propertyNumber?: string;
  duplicate?: string;
  horizontal?: string;
  subRegistration?: string;
  plate?: string;
  type?: string;
  tdProvinceId?: string;
  tdCantonId?: string;
  tdDistrictId?: string;
  area?: number;
  description?: string;
  rights?: string;
}

export interface AssetUpdateRequest {
  firstAuctionTs?: string;
  firstAuctionBase?: number;
  secondAuctionTs?: string;
  secondAuctionBase?: number;
  thirdAuctionTs?: string;
  thirdAuctionBase?: number;
  currency?: Currency;
  liens?: string;
  registration?: string;
  propertyNumber?: string;
  duplicate?: string;
  horizontal?: string;
  subRegistration?: string;
  plate?: string;
  type?: string;
  tdProvinceId?: string;
  tdCantonId?: string;
  tdDistrictId?: string;
  area?: number;
  description?: string;
  rights?: string;
}