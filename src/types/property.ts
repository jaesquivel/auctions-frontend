// Property types
import type { PropertyTagSummary } from './tag';
import type { AssetSummary, Asset } from './asset';
import type { EdictSummary, Edict } from './edict';

export interface PropertyImage {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface PropertyUrl {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface Property {
  id: string;
  // Values
  fiscalValue: number | null;
  marketValue: number | null;
  appraisalValue: number | null;
  usdExchangeRate: number;
  // Calculated fields
  fiscalValueUsd: number | null;
  firstAuctionBaseAdj: number | null;
  firstAuctionGuarantee: number | null;
  registrationFull: string | null;
  geoLocation: string | null;
  fiscalBaseRatio: number | null;
  // Details
  observations: string | null;
  rnpCert: string | null;
  rnpPlan: string | null;
  rnpCertUpdated: string | null;
  rnpPlanUpdated: string | null;
  // Location
  locationCenterLat: number | null;
  locationCenterLon: number | null;
  locationStLat: number | null;
  locationStLon: number | null;
  // Relations
  edict: Edict;
  asset: Asset;
  tags: PropertyTagSummary[];
  images: PropertyImage[];
  urls: PropertyUrl[];
  createdAt: string;
}

export interface PropertySummary {
  id: string;
  fiscalValue: number | null;
  marketValue: number | null;
  appraisalValue: number | null;
  usdExchangeRate: number;
  fiscalValueUsd: number | null;
  firstAuctionBaseAdj: number | null;
  firstAuctionGuarantee: number | null;
  registrationFull: string | null;
  geoLocation: string | null;
  fiscalBaseRatio: number | null;
  edict: EdictSummary;
  asset: AssetSummary;
  tags: PropertyTagSummary[];
  createdAt: string;
}

export interface PropertyCreateRequest {
  assetId: string;
  fiscalValue?: number;
  marketValue?: number;
  appraisalValue?: number;
  usdExchangeRate?: number;
  observations?: string;
  rnpCert?: string;
  rnpPlan?: string;
  locationCenterLat?: number;
  locationCenterLon?: number;
  locationStLat?: number;
  locationStLon?: number;
  tagIds?: string[];
}

export interface PropertyUpdateRequest {
  fiscalValue?: number;
  marketValue?: number;
  appraisalValue?: number;
  usdExchangeRate?: number;
  observations?: string;
  rnpCert?: string;
  rnpPlan?: string;
  locationCenterLat?: number;
  locationCenterLon?: number;
  locationStLat?: number;
  locationStLon?: number;
  tagIds?: string[];
}