import React from 'react';
import type { RouteResponse } from '../types';
import { Clock, Route, Navigation, ExternalLink } from 'lucide-react';

interface RouteResultProps {
  data: RouteResponse | null;
}

const RouteResult: React.FC<RouteResultProps> = ({ data }) => {
  if (!data) return null;

  const origin = data.legs[0].from;
  const destination = data.legs[data.legs.length - 1].to;
  
  const waypoints = data.legs.length > 1 
    ? data.legs.slice(0, -1).map(leg => encodeURIComponent(leg.to)).join('|')
    : '';

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;

  return (
    <div className="glass-card result-container">
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Navigation className="icon" /> Resumo da Viagem
        </div>
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-secondary" 
          style={{ textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          <ExternalLink size={16} /> Ver no Maps
        </a>
      </div>
      <div className="result-summary">
        <div className="summary-item">
          <Route className="summary-icon" size={24} />
          <div className="summary-info">
            <span className="summary-label">Distância Total</span>
            <span className="summary-value">{data.totalDistanceKm} km</span>
          </div>
        </div>
        <div className="summary-item">
          <Clock className="summary-icon" size={24} />
          <div className="summary-info">
            <span className="summary-label">Duração Estimada</span>
            <span className="summary-value">{data.totalDuration}</span>
          </div>
        </div>
      </div>

      <div className="legs-container">
        <h3 className="legs-title">Detalhes do Trajeto</h3>
        <ul className="legs-list">
          {data.legs.map((leg, idx) => (
            <li key={idx} className="leg-item">
              <div className="leg-marker" />
              <div className="leg-content">
                <div className="leg-route">
                  <span className="leg-location">{leg.from}</span>
                  <span className="leg-arrow">→</span>
                  <span className="leg-location">{leg.to}</span>
                </div>
                <div className="leg-details">
                  <span>{leg.distance}</span> • <span>{leg.duration}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteResult;
