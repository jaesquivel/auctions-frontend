// Edict types

// Full party (from detail endpoint)
export interface Party {
  id: string;
  name: string;
  nameSearch: string;
  entityType: number;
  margin: number; // Percentage margin added to first auction base
  createdAt: string;
}

// Full judiciary office (from detail endpoint)
export interface JudiciaryOffice {
  id: string;
  officeCode: number;
  officeName: string;
  address: string | null;
  officialPhone: string | null;
  officialEmail: string | null;
  jurisdiction: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

// Summary types for list endpoint
export interface CreditorSummary {
  name: string;
  margin: number | null;
}

export interface DebtorSummary {
  name: string;
}

export interface JudiciaryOfficeSummary {
  officeName: string;
}

export interface BulletinBrief {
  volume: number;
  year: number;
  processed: boolean;
}

// List endpoint returns EdictSummaryResponse (simplified nested objects)
export interface EdictListItem {
  id: string;
  reference: string;
  caseNumber: string;
  court: string | null;
  publication: number | null;
  publicationCount: number | null;
  createdAt: string;
  bulletinId: string;
  rawEdictId: string;
  creditor: CreditorSummary | null;
  debtor: DebtorSummary | null;
  judiciaryOffice: JudiciaryOfficeSummary | null;
  bulletin: BulletinBrief;
}

// Detail endpoint returns EdictResponse (full nested objects)
export interface Edict {
  id: string;
  reference: string;
  caseNumber: string;
  creditor: Party;
  debtor: Party;
  judiciaryOffice: JudiciaryOffice | null;
  publication: number | null;
  publicationCount: number | null;
  notes: string | null;
  fullText: string | null;
  court: string | null;
  bulletinId: string;
  rawEdictId: string;
  createdAt: string;
}

// Nested reference used by Property, Vehicle, etc.
export interface EdictSummary {
  id: string;
  caseNumber: string;
}

export interface EdictCreateRequest {
  reference: string;
  caseNumber: string;
  creditorId: string;
  debtorId: string;
  judiciaryOfficeId?: string;
  publication?: number;
  publicationCount?: number;
  notes?: string;
  fullText?: string;
  court?: string;
  bulletinId: string;
  rawEdictId: string;
}

export interface EdictUpdateRequest {
  reference?: string;
  caseNumber?: string;
  creditorId?: string;
  debtorId?: string;
  judiciaryOfficeId?: string;
  publication?: number;
  publicationCount?: number;
  notes?: string;
  fullText?: string;
  court?: string;
  bulletinId?: string;
  rawEdictId?: string;
}
