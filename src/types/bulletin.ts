// Bulletin types (Judicial Bulletins for edict extraction)

export interface Bulletin {
  id: string;
  url: string;
  volume: number | null;
  year: number | null;
  document?: string | null;  // Only returned when fetching single bulletin
  processed: boolean;
  createdAt: string;
}

export interface BulletinCreateRequest {
  url: string;
  volume?: number;
  year?: number;
  document?: string;
  processed?: boolean;
}

export interface BulletinUpdateRequest {
  url?: string;
  volume?: number;
  year?: number;
  document?: string;
  processed?: boolean;
}

// Extracted Edict (raw edict from bulletin)
export interface ExtractedEdict {
  id: string;
  bulletinId: string;
  rawText: string;
  caseNumber: string | null;
  reference: string | null;
  processed: boolean;
  createdAt: string;
}

// Extracted Asset (raw asset from bulletin)
export interface ExtractedAsset {
  id: string;
  extractedEdictId: string;
  rawText: string;
  processed: boolean;
  createdAt: string;
}