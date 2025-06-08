import { useState, useEffect } from 'react'
import './App.css'
import { Benefit, mockBenefits } from './types/benefit'
import BenefitCard from './components/BenefitCard'

// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://tu-api-id.execute-api.region.amazonaws.com/dev/benefits';

function App() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        if (import.meta.env.DEV) {
          setBenefits(mockBenefits);
          return;
        }

        try {
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          const data = await response.json();
          setBenefits(data);
        } catch (apiError) {
          console.warn('API fetch failed, using mock data:', apiError);
          setBenefits(mockBenefits);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching benefits');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) return <div className="loading" role="status">Loading benefits...</div>;
  if (error) return <div className="error" role="alert">{error}</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>BenefitFinder</h1>
        <nav className="nav" aria-label="Main navigation">
          <a href="#" className="nav-link" aria-current="page">Home</a>
          <a href="#" className="nav-link">Search</a>
          <a href="#" className="nav-link">Affiliations</a>
          <a href="#" className="nav-link">Profile</a>
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
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.id} benefit={benefit} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App 