import type { Bulletin } from './bulletin';

// Extracted Edict (raw edict from bulletin)
// List endpoint returns RawEdictSummaryResponse (nested bulletin, no notes/fullText)
// Detail endpoint returns RawEdictResponse (bulletinId, includes notes/fullText)
export interface RawEdict {
  id: string;
  reference: string | null;
  creditor: string | null;
  debtor: string | null;
  caseNumber: string | null;
  court: string | null;
  publication: string | null;
  publicationCount: string | null;
  bulletin?: Bulletin;          // Present in list response
  bulletinId?: string;          // Present in detail response
  notes?: string | null;        // Only in detail response
  fullText?: string | null;     // Only in detail response
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
  notes?: string;
  fullText?: string;
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
  notes?: string;
  fullText?: string;
  processed?: boolean;
}