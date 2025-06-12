import { useState, useEffect } from 'react';
import { useBenefits } from '../hooks/useBenefits';
import { Benefit } from '../types/benefit';
import '../styles/BenefitsSearch.css';

export const BenefitsSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [useAI, setUseAI] = useState(false);
  const [userInterest, setUserInterest] = useState<string>('');
  const { benefits, loading, error, search } = useBenefits();

  // Cargar beneficios iniciales sin AI
  useEffect(() => {
    search('', filters, false);
  }, []);

  const handleSearch = async () => {
    if (query.trim()) {
      // Si hay texto de búsqueda, usar AI
      await search(query, filters, true, userInterest);
    } else {
      // Si no hay texto, usar filtros tradicionales
      await search('', filters, false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="benefits-search">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar beneficios..."
          className="search-input"
        />

        <label className="ai-toggle">
          <input
            type="checkbox"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
          />
          Usar búsqueda AI
        </label>
      </div>

      {useAI && (
        <div className="user-interest">
          <input
            type="text"
            value={userInterest}
            onChange={(e) => setUserInterest(e.target.value)}
            placeholder="¿Qué te interesa? (ej: viajes, tecnología, etc.)"
            className="interest-input"
          />
        </div>
      )}

      <div className="filters">
        <select
          value={filters.bank || ''}
          onChange={(e) => handleFilterChange('bank', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los bancos</option>
          <option value="bancodechile">Banco de Chile</option>
          {/* Agregar más bancos aquí */}
        </select>

        <select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          <option value="descuentos">Descuentos</option>
          <option value="cashback">Cashback</option>
          {/* Agregar más categorías aquí */}
        </select>
      </div>

      <button 
        onClick={handleSearch} 
        disabled={loading}
        className="search-button"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="benefits-grid">
        {benefits.map((benefit: Benefit) => (
          <div key={benefit.id} className="benefit-card">
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
            <div className="benefit-details">
              <span className="bank">{benefit.bank}</span>
              <span className="category">{benefit.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 