// Property types
import type { PropertyTagSummary } from './tag';
import type { AssetListItem, Asset } from './asset';
import type { EdictListItem } from './edict';

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
  fullRegistrationNumber: string | null;
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
  asset: Asset;
  tags: PropertyTagSummary[];
  images: PropertyImage[];
  urls: PropertyUrl[];
  createdAt: string;
}

// List endpoint returns PropertySummaryResponse (with nested edict/asset list items)
export interface PropertyListItem {
  id: string;
  fiscalValue: number | null;
  marketValue: number | null;
  appraisalValue: number | null;
  usdExchangeRate: number;
  fiscalValueUsd: number | null;
  firstAuctionBaseAdj: number | null;
  firstAuctionGuarantee: number | null;
  fullRegistrationNumber: string | null;
  fiscalBaseRatio: number | null;
  edict: EdictListItem;
  asset: AssetListItem;
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