import type { Bulletin } from './bulletin';

// Nested raw edict summary (as returned within raw-asset responses)
export interface RawEdictSummary {
  id: string;
  reference: string | null;
  caseNumber: string | null;
  publication: string | null;
  publicationCount: string | null;
  bulletin: Pick<Bulletin, 'volume' | 'year' | 'processed'>;
}

// Raw Asset extracted from bulletin
// Maps to /raw-assets API endpoint
export interface RawAsset {
  id: string;
  rawEdict: RawEdictSummary;
  firstAuctionDate: string | null;
  firstAuctionTime: string | null;
  firstAuctionBase: string | null;
  secondAuctionDate: string | null;
  secondAuctionTime: string | null;
  secondAuctionBase: string | null;
  thirdAuctionDate: string | null;
  thirdAuctionTime: string | null;
  thirdAuctionBase: string | null;
  currency: string | null;
  registration: string | null;
  plate: string | null;
  type: string | null;
  tdDistrict: string | null;
  tdCanton: string | null;
  tdProvince: string | null;
  area: string | null;
  processed: boolean;
  createdAt: string;
}

// Alias for backwards compatibility
export type ExtractedAsset = RawAsset;

export interface RawAssetUpdateRequest {
  firstAuctionDate?: string;
  firstAuctionTime?: string;
  firstAuctionBase?: string;
  secondAuctionDate?: string;
  secondAuctionTime?: string;
  secondAuctionBase?: string;
  thirdAuctionDate?: string;
  thirdAuctionTime?: string;
  thirdAuctionBase?: string;
  currency?: string;
  registration?: string;
  plate?: string;
  type?: string;
  tdDistrict?: string;
  tdCanton?: string;
  tdProvince?: string;
  area?: string;
  processed?: boolean;
}