// Asset types
import type { TdProvinceSummary, TdCantonSummary, TdDistrictSummary } from './territorial';
import type { EdictListItem } from './edict';
import type { Currency } from './common';

// List endpoint returns AssetSummaryResponse (with nested edict, no liens/description)
export interface AssetListItem {
  id: string;
  edictId: string;
  rawAssetId: string;
  // Auction information
  firstAuctionTs: string | null;
  firstAuctionBase: number | null;
  secondAuctionTs: string | null;
  secondAuctionBase: number | null;
  thirdAuctionTs: string | null;
  thirdAuctionBase: number | null;
  currency: Currency;
  // Property registration
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
  rights: string | null;
  // Nested edict
  edict: EdictListItem;
  createdAt: string;
}

// Edict sub-types nested inside Asset (from PropertyAssetResponse)
export interface AssetEdictCreditor {
  id: string;
  name: string;
  entityType: number;
  margin: number;
}

export interface AssetEdictDebtor {
  id: string;
  name: string;
  entityType: number;
}

export interface AssetEdictJudiciaryOffice {
  id: string;
  sigapjCode: number;
  officeName: string;
  popularName: string | null;
}

export interface AssetEdictBulletin {
  id: string;
  volume: number;
  year: number;
}

export interface AssetEdict {
  id: string;
  reference: string;
  caseNumber: string;
  publication: number | null;
  publicationCount: number | null;
  notes: string | null;
  fullText: string | null;
  court: string | null;
  rawEdictId: string;
  creditor: AssetEdictCreditor;
  debtor: AssetEdictDebtor;
  judiciaryOffice: AssetEdictJudiciaryOffice | null;
  bulletin: AssetEdictBulletin;
}

// Detail endpoint returns AssetResponse (full territorial, includes liens/description)
export interface Asset {
  id: string;
  edictId: string;
  rawAssetId: string;
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
  // Nested edict
  edict: AssetEdict;
  createdAt: string;
}

// Nested reference used by Property (detail)
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
  rawAssetId: string;
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