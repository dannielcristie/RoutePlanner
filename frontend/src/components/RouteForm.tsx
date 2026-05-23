import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Map } from 'lucide-react';

interface RouteFormProps {
  onSubmit: (points: string[]) => void;
  loading: boolean;
}

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, loading }) => {
  const [points, setPoints] = useState<string[]>(['', '']);

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, '']);
  };

  const removePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPoints = points.map(p => p.trim()).filter(p => p.length > 0);
    if (validPoints.length >= 2) {
      onSubmit(validPoints);
    } else {
      alert('Por favor, informe pelo menos uma origem e um destino válidos.');
    }
  };

  return (
    <form className="glass-card form-container" onSubmit={handleSubmit}>
      <h2 className="card-title">
        <Map className="icon" /> Planejar Rota
      </h2>
      <div className="points-list">
        {points.map((point, index) => (
          <div key={index} className="point-input-group">
            <div className="point-marker">
              {index === 0 ? 'A' : index === points.length - 1 ? 'B' : index}
            </div>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={18} />
              <input
                type="text"
                placeholder={index === 0 ? "Origem (Ex: Fortaleza)" : index === points.length - 1 ? "Destino" : "Ponto intermediário"}
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
                required={index === 0 || index === points.length - 1}
              />
            </div>
            {points.length > 2 && (
              <button
                type="button"
                className="btn-icon remove-btn"
                onClick={() => removePoint(index)}
                title="Remover ponto"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={addPoint}>
          <Plus size={18} /> Adicionar Parada
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular Rota'}
        </button>
      </div>
    </form>
  );
};

export default RouteForm;
