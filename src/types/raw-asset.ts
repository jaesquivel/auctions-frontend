// Extracted Asset (raw asset from bulletin)
export interface ExtractedAsset {
  id: string;
  extractedEdictId: string;
  rawText: string;
  processed: boolean;
  createdAt: string;
}