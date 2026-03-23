// Vehicle Tag types

export interface VehicleTag {
  id: string;
  name: string;
  description: string | null;
  color: string; // Hex color code #RRGGBB
  createdAt: string;
}

export interface VehicleTagSummary {
  id: string;
  name: string;
  color: string;
}

export interface VehicleTagCreateRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface VehicleTagUpdateRequest {
  name?: string;
  description?: string;
  color?: string;
}