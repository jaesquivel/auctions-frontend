// Property Tag types

export interface PropertyTag {
  id: string;
  name: string;
  description: string | null;
  color: string; // Hex color code #RRGGBB
  createdAt: string;
}

export interface PropertyTagSummary {
  id: string;
  name: string;
  color: string;
}

export interface PropertyTagCreateRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface PropertyTagUpdateRequest {
  name?: string;
  description?: string;
  color?: string;
}