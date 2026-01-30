// Edict types

export interface Party {
  id: string;
  name: string;
  nameSearch: string;
  entityType: number;
  margin: number; // Percentage margin added to first auction base
  createdAt: string;
}

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
  bulletinId: string | null;
  createdAt: string;
}

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
  bulletinId?: string;
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
}