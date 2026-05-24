import { useState, useEffect } from 'react';
import RouteForm from './components/RouteForm';
import RouteResult from './components/RouteResult';
import { getRouteInfo } from './services/api';
import type { RouteResponse } from './types';
import { Map as MapIcon, Clock, ArrowRight, X } from 'lucide-react';

function App() {
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[][]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('routeHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleCalculateRoute = async (points: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRouteInfo(points);
      setRouteData(data);
      
      const newHistory = [points, ...history.filter(h => JSON.stringify(h) !== JSON.stringify(points))].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('routeHistory', JSON.stringify(newHistory));
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erro ao calcular a rota');
      setRouteData(null);
    } finally {
      setLoading(false);
    }
  };

  const removeHistoryItem = (e: React.MouseEvent, idxToRemove: number) => {
    e.stopPropagation();
    const newHistory = history.filter((_, idx) => idx !== idxToRemove);
    setHistory(newHistory);
    localStorage.setItem('routeHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <MapIcon className="header-icon" size={32} />
        <h1>Route Planner</h1>
        <p>Planeje sua viagem com facilidade</p>
      </header>

      <main className="app-main">
        <RouteForm onSubmit={handleCalculateRoute} loading={loading} />

        {history.length > 0 && (
          <div className="history-container glass-card">
            <h3><Clock size={16} /> Rotas Recentes</h3>
            <div className="history-chips">
              {history.map((route, idx) => (
                <div key={idx} className={`history-chip ${loading ? 'disabled' : ''}`}>
                  <button 
                    className="history-chip-action" 
                    onClick={() => handleCalculateRoute(route)}
                    disabled={loading}
                  >
                    <span className="history-chip-text">
                      {route[0].split(',')[0]} <ArrowRight size={12} className="inline-icon" /> {route[route.length-1].split(',')[0]}
                    </span>
                  </button>
                  <button 
                    className="history-chip-delete" 
                    onClick={(e) => removeHistoryItem(e, idx)}
                    disabled={loading}
                    title="Remover do histórico"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-message glass-card">
            <p>{error}</p>
          </div>
        )}

        <RouteResult data={routeData} />
      </main>
    </div>
  );
}

export default App;
