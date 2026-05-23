import React from 'react';
import { RouteResponse } from '../types';
import { Clock, Route, Navigation } from 'lucide-react';

interface RouteResultProps {
  data: RouteResponse | null;
}

const RouteResult: React.FC<RouteResultProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="glass-card result-container">
      <h2 className="card-title">
        <Navigation className="icon" /> Resumo da Viagem
      </h2>
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
