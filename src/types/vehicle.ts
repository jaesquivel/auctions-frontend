// Vehicle types (for vehicles in auction)
import type { Currency } from './common';
import type { EdictSummary } from './edict';

export interface Vehicle {
  id: string;
  // Identification
  plate: string;
  vin: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  // Auction info
  firstAuctionTs: string | null;
  firstAuctionBase: number | null;
  secondAuctionTs: string | null;
  secondAuctionBase: number | null;
  currency: Currency;
  // Details
  description: string | null;
  observations: string | null;
  // Relations
  edictId: string;
  edict?: EdictSummary;
  createdAt: string;
}

export interface VehicleSummary {
  id: string;
  plate: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  firstAuctionTs: string | null;
  firstAuctionBase: number | null;
  currency: Currency;
  edict?: EdictSummary;
}

export interface VehicleCreateRequest {
  edictId: string;
  plate: string;
  vin?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  firstAuctionTs?: string;
  firstAuctionBase?: number;
  secondAuctionTs?: string;
  secondAuctionBase?: number;
  currency?: Currency;
  description?: string;
  observations?: string;
}

export interface VehicleUpdateRequest {
  plate?: string;
  vin?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  firstAuctionTs?: string;
  firstAuctionBase?: number;
  secondAuctionTs?: string;
  secondAuctionBase?: number;
  currency?: Currency;
  description?: string;
  observations?: string;
}