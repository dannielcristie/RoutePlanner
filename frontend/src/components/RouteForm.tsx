import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Map, Settings, GripVertical } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RouteFormProps {
  onSubmit: (points: string[]) => void;
  loading: boolean;
}

type RouteMode = 'custom' | 'origem-destino' | 'base-origem-destino-base' | 'base-origem-base';

interface PointItem {
  id: string;
  value: string;
}

const SortablePointItem = ({ 
  item, index, total, onChange, onRemove 
}: { 
  item: PointItem, index: number, total: number, onChange: (val: string) => void, onRemove: () => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="point-input-group">
      <div {...attributes} {...listeners} className="drag-handle" style={{ cursor: 'grab', color: 'var(--text-muted)' }}>
        <GripVertical size={18} />
      </div>
      <div className="point-marker">
        {index === 0 ? 'A' : index === total - 1 ? 'B' : index}
      </div>
      <div className="input-wrapper">
        <MapPin className="input-icon" size={18} />
        <AutocompleteInput
          type="text"
          placeholder={index === 0 ? "Origem (Endereço ou Coordenadas)" : index === total - 1 ? "Destino (Endereço ou Coordenadas)" : "Ponto intermediário"}
          value={item.value}
          onChange={(e) => onChange(e.target.value)}
          onPlaceSelected={(addr) => onChange(addr)}
          required={index === 0 || index === total - 1}
        />
      </div>
      {total > 2 && (
        <button
          type="button"
          className="btn-icon remove-btn"
          onClick={onRemove}
          title="Remover ponto"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, loading }) => {
  const [mode, setMode] = useState<RouteMode>('origem-destino');
  
  // Custom mode points
  const [customPoints, setCustomPoints] = useState<PointItem[]>([
    { id: '1', value: '' },
    { id: '2', value: '' }
  ]);
  
  // Preset mode points
  const [base, setBase] = useState('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCustomPoints((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCustomPointChange = (index: number, value: string) => {
    const newPoints = [...customPoints];
    newPoints[index] = { ...newPoints[index], value };
    setCustomPoints(newPoints);
  };

  const addCustomPoint = () => {
    setCustomPoints([...customPoints, { id: Date.now().toString(), value: '' }]);
  };

  const removeCustomPoint = (index: number) => {
    const newPoints = customPoints.filter((_, i) => i !== index);
    setCustomPoints(newPoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPoints: string[] = [];

    if (mode === 'custom') {
      finalPoints = customPoints.map(p => p.value.trim()).filter(p => p.length > 0);
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
        {mode === 'custom' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={customPoints.map(p => p.id)} strategy={verticalListSortingStrategy}>
              {customPoints.map((item, index) => (
                <SortablePointItem 
                  key={item.id}
                  item={item}
                  index={index}
                  total={customPoints.length}
                  onChange={(val) => handleCustomPointChange(index, val)}
                  onRemove={() => removeCustomPoint(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {mode !== 'custom' && (
          <>
            {(mode === 'base-origem-destino-base' || mode === 'base-origem-base') && (
              <div className="point-input-group">
                <div className="point-marker">B</div>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <AutocompleteInput
                    type="text"
                    placeholder="Base (Garagem, Coordenadas, etc.)"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    onPlaceSelected={(addr) => setBase(addr)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="point-input-group">
              <div className="point-marker">O</div>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <AutocompleteInput
                  type="text"
                  placeholder="Origem (Endereço, Local ou Coordenadas)"
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  onPlaceSelected={(addr) => setOrigem(addr)}
                  required
                />
              </div>
            </div>

            {(mode === 'origem-destino' || mode === 'base-origem-destino-base') && (
              <div className="point-input-group">
                <div className="point-marker">D</div>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <AutocompleteInput
                    type="text"
                    placeholder="Destino (Endereço, Local ou Coordenadas)"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    onPlaceSelected={(addr) => setDestino(addr)}
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
