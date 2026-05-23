export interface RouteRequest {
  points: string[];
}

export interface LegInfo {
  from: string;
  to: string;
  distance: string;
  duration: string;
  distanceValue: number; // in meters for calculation
  durationValue: number; // in seconds for calculation
}

export interface RouteResponse {
  totalDistanceKm: number;
  totalDuration: string;
  legs: Omit<LegInfo, 'distanceValue' | 'durationValue'>[];
}
