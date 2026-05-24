import axios from 'axios';

interface RoutesApiResponse {
  routes?: {
    distanceMeters: number;
    duration: string;
    legs: {
      distanceMeters: number;
      duration: string;
    }[];
  }[];
  error?: {
    message: string;
    status: string;
  };
}

interface GoogleMapsResponse {
  routes: {
    legs: {
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      start_address: string;
      end_address: string;
    }[];
  }[];
  status: string;
  error_message?: string;
}

export class GoogleMapsService {
  private static readonly BASE_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  static async getDirections(origin: string, destination: string, waypoints: string[]): Promise<GoogleMapsResponse> {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }

    const data = {
      origin: { address: origin },
      destination: { address: destination },
      intermediates: waypoints.map(wp => ({ address: wp })),
      travelMode: 'DRIVE'
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs.distanceMeters,routes.legs.duration'
    };

    try {
      const response = await axios.post<RoutesApiResponse>(this.BASE_URL, data, { headers });
      
      const routesData = response.data;
      if (!routesData.routes || routesData.routes.length === 0) {
        throw new Error('No routes found');
      }

      const mappedRoutes = routesData.routes.map(route => {
        return {
          legs: route.legs.map(leg => {
            const distanceVal = leg.distanceMeters || 0;
            const durationSec = parseInt((leg.duration || '0s').replace('s', ''), 10);
            
            const km = distanceVal / 1000;
            const distanceText = km >= 1 ? `${km.toFixed(1)} km` : `${distanceVal} m`;

            const hours = Math.floor(durationSec / 3600);
            const mins = Math.floor((durationSec % 3600) / 60);
            const durationText = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;

            return {
              distance: {
                value: distanceVal,
                text: distanceText
              },
              duration: {
                value: durationSec,
                text: durationText
              },
              start_address: '',
              end_address: ''
            };
          })
        };
      });

      return {
        routes: mappedRoutes,
        status: 'OK'
      };
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(`Google Maps API error: ${error.response.data.error.message}`);
      }
      throw error;
    }
  }
}

