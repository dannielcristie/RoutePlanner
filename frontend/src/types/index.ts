export interface RouteRequest {
  points: string[];
}

export interface LegInfo {
  from: string;
  to: string;
  distance: string;
  duration: string;
}

export interface RouteResponse {
  totalDistanceKm: number;
  totalDuration: string;
  legs: LegInfo[];
}
