import { useState, useEffect } from 'react';
import { useBenefits } from '../hooks/useBenefits';
import { Benefit } from '../types/benefit';
import '../styles/BenefitsSearch.css';

const CATEGORIES = [
  { label: 'Todos', value: '' },
  { label: 'Tiendas y Servicios', value: 'Tiendas y Servicios' },
  { label: 'Gimnasios', value: 'Gimnasios' },
  { label: 'Recreación y Entretención', value: 'Recreación y Entretención' },
  { label: 'Salud y Estética', value: 'Salud y Estética' },
  { label: 'Gastronomía', value: 'Gastronomía' },
  { label: 'Viajes, Hoteles y Trasporte', value: 'Viajes, Hoteles y Trasporte' },
  { label: 'Cursos', value: 'Cursos' },
];

export const BenefitsSearch = () => {
  const [query, setQuery] = useState('');
  const [keywords, setKeywords] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({ category: '' });
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const { benefits, error, search } = useBenefits();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBenefit, setModalBenefit] = useState<Benefit | null>(null);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);

  useEffect(() => {
    search('', filters, false);
  }, [filters.category]);

  useEffect(() => {
    // Filtrar por palabras clave cuando cambian los benefits o keywords
    if (keywords.trim() === '') {
      setFilteredBenefits(benefits);
    } else {
      const keywordsLower = keywords.toLowerCase();
      setFilteredBenefits(
        benefits.filter(benefit => 
          benefit.name?.toLowerCase().includes(keywordsLower) || 
          benefit.description?.toLowerCase().includes(keywordsLower)
        )
      );
    }
  }, [benefits, keywords]);

  const handleSearch = async () => {
    if (query.trim()) {
      setIsSearchingAI(true);
      await search(query, filters, true);
      setIsSearchingAI(false);
    } else {
      await search('', filters, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Ya se actualiza automáticamente por el useEffect
    }
  };

  const handleTabClick = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const openModal = (benefit: Benefit) => {
    setModalBenefit(benefit);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalBenefit(null);
  };

  return (
    <div className="benefits-search">
      <div className="ai-assistant-light">
        <div className="ai-header">
          <span className="ai-star">★</span>
          <span className="ai-title">AI Benefits Assistant</span>
        </div>
        <p className="assistant-description-light">
          Tell me what you're looking for or where you're shopping, and I'll find your best options
        </p>
        <div className="search-container-light">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a product or store..."
            className="search-input-light"
          />
          <button 
            onClick={handleSearch} 
            disabled={isSearchingAI}
            className="search-button-subtle"
          >
            {isSearchingAI ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Filtros como tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`category-tab${filters.category === cat.value ? ' active' : ''}`}
            onClick={() => handleTabClick(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Barra de búsqueda por palabras clave */}
      <div className="keyword-search-container">
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          onKeyPress={handleKeywordKeyPress}
          placeholder="Buscar por nombre o descripción..."
          className="keyword-search-input"
        />
      </div>

      {error && (
        <div className="error-message-light">
          {error}
        </div>
      )}

      <div className="benefits-grid-light">
        {filteredBenefits.map((benefit: Benefit) => (
          <div key={benefit.id} className="benefit-card-light" onClick={() => openModal(benefit)}>
            <div className="benefit-badge-light">
              {benefit.name ? benefit.name.charAt(0) : '?'}
            </div>
            <div className="benefit-info-light">
              <h3>{benefit.name}</h3>
              <p className="category-light">{benefit.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para la descripción */}
      {modalOpen && modalBenefit && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{modalBenefit.name}</h2>
            <p>{modalBenefit.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}; 