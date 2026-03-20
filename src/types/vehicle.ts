// Vehicle types
import type { VehicleTagSummary } from './vehicle-tag';

export interface VehicleEdictCreditor {
  id?: string;
  name: string;
  margin: number;
}

export interface VehicleEdictDebtor {
  id?: string;
  name: string;
}

export interface VehicleEdictJudiciaryOffice {
  id?: string;
  officeName: string;
  sigapjCode?: number | null;
}

export interface VehicleEdictBulletin {
  id: string;
  volume: number;
  year: number;
}

export interface VehicleEdict {
  id: string;
  reference: string;
  caseNumber: string;
  court: string;
  publication: number;
  publicationCount: number;
  rawEdictId: string;
  creditor: VehicleEdictCreditor;
  debtor: VehicleEdictDebtor;
  judiciaryOffice: VehicleEdictJudiciaryOffice;
  bulletin: VehicleEdictBulletin;
  notes?: string | null;
  fullText?: string | null;
}

export interface VehicleAsset {
  id: string;
  rawAssetId: string;
  firstAuctionTs: string | null;
  firstAuctionBase: number | null;
  secondAuctionTs: string | null;
  secondAuctionBase: number | null;
  thirdAuctionTs: string | null;
  thirdAuctionBase: number | null;
  currency: string;
  edict: VehicleEdict;
}

export interface Vehicle {
  id: string;
  // Values
  fiscalValue: number | null;
  marketValue: number | null;
  appraisalValue: number | null;
  usdExchangeRate: number;
  fiscalValueUsd: number | null;
  firstAuctionBaseAdj: number | null;
  firstAuctionGuarantee: number | null;
  // RNP
  rnpRecord: string | null;
  rnpRecordUpdated: string | null;
  // Details
  observations: string | null;
  notes: string | null;
  // Registration
  plate: string;
  plateClass: string | null;
  plateCode: string | null;
  registrationVolume: string | null;
  registrationEntry: string | null;
  registrationSequence: string | null;
  registrationDate: string | null;
  // Vehicle ID
  vin: string | null;
  chassisNumber: string | null;
  // Description
  make: string | null;
  model: string | null;
  year: number | null;
  bodyStyle: string | null;
  passengerCapacity: number | null;
  doorCount: number | null;
  // Fuel & drivetrain
  fuelType: string | null;
  transmissionType: string | null;
  drivetrain: string | null;
  // Engine
  engineNumber: string | null;
  engineMake: string | null;
  engineModel: string | null;
  engineDisplacementCc: number | null;
  cylinderCount: number | null;
  powerKw: number | null;
  // EV
  batteryCapacityKwh: number | null;
  rangeKm: number | null;
  chargingType: string | null;
  fastChargeSupported: boolean | null;
  // Condition
  condition: string | null;
  mileageKm: number | null;
  // Dimensions / weight
  netWeightKg: number | null;
  grossVehicleWeightKg: number | null;
  lengthM: number | null;
  // Colors
  exteriorColor: string | null;
  interiorColor: string | null;
  // Contract
  contractValue: number | null;
  contractCurrency: string | null;
  // Relations
  asset: VehicleAsset;
  tags: VehicleTagSummary[];
  createdAt: string;
}

export type VehicleListItem = Vehicle;

export interface VehicleUpdateRequest {
  fiscalValue?: number;
  marketValue?: number;
  appraisalValue?: number;
  usdExchangeRate?: number;
  observations?: string;
  mileageKm?: number;
  exteriorColor?: string;
  interiorColor?: string;
  condition?: string;
  tagIds?: string[];
}
