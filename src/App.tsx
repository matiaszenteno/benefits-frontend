import { useState, useEffect } from 'react'
import './App.css'

interface Benefit {
  id: number;
  name: string;
  description: string;
}

// Datos de prueba para desarrollo
const mockBenefits: Benefit[] = [
  {
    id: 1,
    name: "Seguro Médico",
    description: "Cobertura médica completa para el empleado y su familia"
  },
  {
    id: 2,
    name: "Vale de Despensa",
    description: "Vale mensual para gastos de despensa"
  },
  {
    id: 3,
    name: "Gimnasio",
    description: "Membresía anual en gimnasio de la ciudad"
  },
  {
    id: 4,
    name: "Día de Cumpleaños",
    description: "Día libre en tu cumpleaños"
  },
  {
    id: 5,
    name: "Home Office",
    description: "Flexibilidad para trabajar desde casa"
  }
];

function App() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        // En desarrollo usamos datos mock
        if (import.meta.env.DEV) {
          setBenefits(mockBenefits);
          return;
        }

        // En producción intentamos la API real
        try {
          const response = await fetch('https://tu-api-id.execute-api.region.amazonaws.com/dev/benefits');
          if (!response.ok) throw new Error('Failed to fetch benefits');
          const data = await response.json();
          setBenefits(data);
        } catch (apiError) {
          console.warn('API fetch failed, using mock data:', apiError);
          setBenefits(mockBenefits);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) return <div className="loading">Loading benefits...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1>Matias Zenteno Cosas</h1>
      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="benefit-card">
            <h2>{benefit.name}</h2>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App 