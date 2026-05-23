import { Request, Response } from 'express';
import { RouteRequest, RouteResponse, LegInfo } from '../types';
import { GoogleMapsService } from '../services/googleMapsService';

export const calculateRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { points } = req.body as RouteRequest;

    if (!points || !Array.isArray(points) || points.length < 2) {
      res.status(400).json({ error: 'At least two points (origin and destination) are required.' });
      return;
    }

    const origin = points[0];
    const destination = points[points.length - 1];
    const waypoints = points.slice(1, -1);

    const data = await GoogleMapsService.getDirections(origin, destination, waypoints);

    if (!data.routes || data.routes.length === 0) {
      res.status(404).json({ error: 'No routes found for the given points.' });
      return;
    }

    const route = data.routes[0];
    let totalDistanceValue = 0;
    let totalDurationValue = 0;

    const legs: Omit<LegInfo, 'distanceValue' | 'durationValue'>[] = route.legs.map((leg, index) => {
      totalDistanceValue += leg.distance.value;
      totalDurationValue += leg.duration.value;

      return {
        from: points[index],
        to: points[index + 1],
        distance: leg.distance.text,
        duration: leg.duration.text
      };
    });

    const totalDistanceKm = Math.round((totalDistanceValue / 1000) * 10) / 10;
    
    // Convert duration in seconds to hours and minutes
    const hours = Math.floor(totalDurationValue / 3600);
    const minutes = Math.floor((totalDurationValue % 3600) / 60);
    let totalDuration = '';
    if (hours > 0) {
      totalDuration += `${hours}h `;
    }
    totalDuration += `${minutes}min`;

    const response: RouteResponse = {
      totalDistanceKm,
      totalDuration: totalDuration.trim(),
      legs
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error calculating route:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
