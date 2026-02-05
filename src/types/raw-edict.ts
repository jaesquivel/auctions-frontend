import type { Bulletin } from './bulletin';

// Extracted Edict (raw edict from bulletin)
// Maps to /raw-edicts API endpoint
export interface RawEdict {
  id: string;
  reference: string | null;
  creditor: string | null;
  debtor: string | null;
  caseNumber: string | null;
  court: string | null;
  publication: string | null;
  publicationCount: string | null;
  bulletin: Bulletin;
  processed: boolean;
  createdAt: string;
}

// Alias for backwards compatibility
export type ExtractedEdict = RawEdict;

export interface RawEdictCreateRequest {
  reference?: string;
  creditor?: string;
  debtor?: string;
  caseNumber?: string;
  court?: string;
  publication?: string;
  publicationCount?: string;
  bulletinId: string;
  processed?: boolean;
}

export interface RawEdictUpdateRequest {
  reference?: string;
  creditor?: string;
  debtor?: string;
  caseNumber?: string;
  court?: string;
  publication?: string;
  publicationCount?: string;
  processed?: boolean;
}
