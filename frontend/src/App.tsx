import { useState } from 'react';
import RouteForm from './components/RouteForm';
import RouteResult from './components/RouteResult';
import { getRouteInfo } from './services/api';
import { RouteResponse } from './types';
import { Map as MapIcon } from 'lucide-react';

function App() {
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculateRoute = async (points: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRouteInfo(points);
      setRouteData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erro ao calcular a rota');
      setRouteData(null);
    } finally {
      setLoading(false);
    }
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
