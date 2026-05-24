import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Map, Settings } from 'lucide-react';

interface RouteFormProps {
  onSubmit: (points: string[]) => void;
  loading: boolean;
}

type RouteMode = 'custom' | 'origem-destino' | 'base-origem-destino-base' | 'base-origem-base';

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, loading }) => {
  const [mode, setMode] = useState<RouteMode>('origem-destino');
  
  // Custom mode points
  const [customPoints, setCustomPoints] = useState<string[]>(['', '']);
  
  // Preset mode points
  const [base, setBase] = useState('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  const handleCustomPointChange = (index: number, value: string) => {
    const newPoints = [...customPoints];
    newPoints[index] = value;
    setCustomPoints(newPoints);
  };

  const addCustomPoint = () => {
    setCustomPoints([...customPoints, '']);
  };

  const removeCustomPoint = (index: number) => {
    const newPoints = customPoints.filter((_, i) => i !== index);
    setCustomPoints(newPoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPoints: string[] = [];

    if (mode === 'custom') {
      finalPoints = customPoints.map(p => p.trim()).filter(p => p.length > 0);
    } else if (mode === 'origem-destino') {
      finalPoints = [origem, destino].map(p => p.trim()).filter(p => p.length > 0);
    } else if (mode === 'base-origem-destino-base') {
      finalPoints = [base, origem, destino, base].map(p => p.trim()).filter(p => p.length > 0);
    } else if (mode === 'base-origem-base') {
      finalPoints = [base, origem, base].map(p => p.trim()).filter(p => p.length > 0);
    }

    if (finalPoints.length >= 2) {
      onSubmit(finalPoints);
    } else {
      alert('Por favor, preencha todos os campos obrigatórios da rota.');
    }
  };

  return (
    <form className="glass-card form-container" onSubmit={handleSubmit}>
      <h2 className="card-title">
        <Map className="icon" /> Planejar Rota
      </h2>

      <div className="mode-selector">
        <label className="mode-label">
          <Settings size={16} /> Tipo de Rota:
        </label>
        <select 
          className="mode-select" 
          value={mode} 
          onChange={(e) => setMode(e.target.value as RouteMode)}
        >
          <option value="origem-destino">Origem para Destino</option>
          <option value="base-origem-base">Base ➔ Origem ➔ Base</option>
          <option value="base-origem-destino-base">Base ➔ Origem ➔ Destino ➔ Base</option>
          <option value="custom">Personalizado (Múltiplos Pontos)</option>
        </select>
      </div>

      <div className="points-list">
        {mode === 'custom' && customPoints.map((point, index) => (
          <div key={index} className="point-input-group">
            <div className="point-marker">
              {index === 0 ? 'A' : index === customPoints.length - 1 ? 'B' : index}
            </div>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={18} />
              <input
                type="text"
                placeholder={index === 0 ? "Origem (Endereço ou Coordenadas)" : index === customPoints.length - 1 ? "Destino (Endereço ou Coordenadas)" : "Ponto intermediário"}
                value={point}
                onChange={(e) => handleCustomPointChange(index, e.target.value)}
                required={index === 0 || index === customPoints.length - 1}
              />
            </div>
            {customPoints.length > 2 && (
              <button
                type="button"
                className="btn-icon remove-btn"
                onClick={() => removeCustomPoint(index)}
                title="Remover ponto"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}

        {mode !== 'custom' && (
          <>
            {(mode === 'base-origem-destino-base' || mode === 'base-origem-base') && (
              <div className="point-input-group">
                <div className="point-marker">B</div>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Base (Garagem, Coordenadas, etc.)"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="point-input-group">
              <div className="point-marker">O</div>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Origem (Endereço, Local ou Coordenadas)"
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  required
                />
              </div>
            </div>

            {(mode === 'origem-destino' || mode === 'base-origem-destino-base') && (
              <div className="point-input-group">
                <div className="point-marker">D</div>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Destino (Endereço, Local ou Coordenadas)"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="form-actions">
        {mode === 'custom' ? (
          <button type="button" className="btn-secondary" onClick={addCustomPoint}>
            <Plus size={18} /> Adicionar Parada
          </button>
        ) : (
          <div></div> /* Spacer */
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular Rota'}
        </button>
      </div>
    </form>
  );
};

export default RouteForm;
