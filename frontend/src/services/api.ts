import axios from 'axios';
import type { RouteResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getRouteInfo = async (points: string[]): Promise<RouteResponse> => {
  const response = await api.post<RouteResponse>('/route', { points });
  return response.data;
};
