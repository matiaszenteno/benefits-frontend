import { useState, useEffect } from 'react'
import './App.css'
import { getBenefits, Benefit } from './services/api'
// import BenefitCard from './components/BenefitCard'

const CATEGORIES = [
  'Tiendas y Servicios',
  'Gimnasios',
  'Recreación y Entretención',
  'Salud y Estética',
  'Gastronomía',
  'Viajes, Hoteles y Trasporte',
  'Cursos'
];

function App() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBenefits();
        setBenefits(data);
        setFilteredBenefits(data);
      } catch (apiError) {
        setError('Error al cargar los beneficios');
        console.error('Error:', apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  useEffect(() => {
    let filtered = benefits;

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(benefit => benefit.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(benefit => 
        benefit.name.toLowerCase().includes(query) || 
        benefit.description.toLowerCase().includes(query)
      );
    }

    setFilteredBenefits(filtered);
  }, [selectedCategory, searchQuery, benefits]);

  if (loading) return <div className="loading" role="status">Loading benefits...</div>;
  if (error) return <div className="error" role="alert">{error}</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>BenefitFinder</h1>
        <nav className="nav" aria-label="Main navigation">
          <a href="#" className="nav-link" aria-current="page">Home</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="ai-assistant">
          <h2>
            <svg className="sparkles-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M12 2L9.5 8.5L2 8.5L7.5 13L5 19.5L12 15L19 19.5L16.5 13L22 8.5L14.5 8.5L12 2Z" />
            </svg>
            AI Benefits Assistant
          </h2>
          <p className="assistant-description">
            Tell me what you're looking for or where you're shopping, and I'll find your best options
          </p>
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for a product or store..."
              aria-label="Search benefits"
            />
          </div>
        </section>

        <section className="featured-benefits">
          <div className="section-header">
            <h2>Featured Benefits</h2>
            <a href="#" className="view-all">View all</a>
          </div>

          <div className="categories">
            <button 
              className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              Todos
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="benefits-grid">
            {filteredBenefits.map((benefit) => (
              <div 
                key={benefit.id} 
                className="benefit-card"
                onClick={() => setSelectedBenefit(benefit)}
              >
                <div className="benefit-badge">
                  {benefit.name.charAt(0)}
                </div>
                <div className="benefit-info">
                  <h3>{benefit.name}</h3>
                  <p className="category">{benefit.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedBenefit && (
        <div className="modal-overlay" onClick={() => setSelectedBenefit(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBenefit(null)}>×</button>
            <div className="modal-header">
              <div className="benefit-badge large">
                {selectedBenefit.name.charAt(0)}
              </div>
              <h2>{selectedBenefit.name}</h2>
              <p className="category">{selectedBenefit.category}</p>
            </div>
            <div className="modal-body">
              <p>{selectedBenefit.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App 