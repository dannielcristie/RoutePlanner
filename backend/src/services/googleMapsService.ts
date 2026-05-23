import axios from 'axios';

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
  private static readonly BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

  static async getDirections(origin: string, destination: string, waypoints: string[]) {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }

    const params: any = {
      origin,
      destination,
      key: apiKey,
      mode: 'driving'
    };

    if (waypoints.length > 0) {
      params.waypoints = waypoints.join('|');
    }

    const response = await axios.get<GoogleMapsResponse>(this.BASE_URL, { params });
    
    if (response.data.status !== 'OK') {
      throw new Error(response.data.error_message || `Google Maps API error: ${response.data.status}`);
    }

    return response.data;
  }
}
