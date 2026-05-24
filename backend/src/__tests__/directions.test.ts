import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import { GoogleMapsService } from '../services/googleMapsService';

// Mocking GoogleMapsService directly to avoid external API calls
vi.mock('../services/googleMapsService', () => {
  return {
    GoogleMapsService: {
      getDirections: vi.fn(),
    },
  };
});

describe('POST /route', () => {
  it('should return 400 if required points are missing', async () => {
    const response = await request(app).post('/route').send({
      points: ['A'], // Only 1 point, should fail
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('At least two points');
  });

  it('should return 200 and route data for valid points', async () => {
    // Setup the mock to return a fake route
    (GoogleMapsService.getDirections as any).mockResolvedValueOnce({
      routes: [
        {
          legs: [
            {
              distance: { value: 1000, text: '1.0 km' },
              duration: { value: 600, text: '10min' },
              start_address: 'Point A',
              end_address: 'Point B',
            },
          ],
        },
      ],
      status: 'OK',
    });

    const response = await request(app).post('/route').send({
      points: ['Point A', 'Point B'],
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalDistanceKm');
    expect(response.body).toHaveProperty('totalDuration');
    expect(response.body).toHaveProperty('legs');
    expect(response.body.totalDistanceKm).toBe(1); // 1.0 km -> 1
    expect(response.body.totalDuration).toBe('10min'); // 10 min
  });

  it('should return 500 if Google Maps throws an error', async () => {
    // Setup the mock to throw an error
    (GoogleMapsService.getDirections as any).mockRejectedValueOnce(
      new Error('Erro na API do Google')
    );

    const response = await request(app).post('/route').send({
      points: ['Invalid A', 'Invalid B'],
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Erro na API do Google');
  });
});
