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
