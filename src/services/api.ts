import axios from 'axios';
import { Benefit } from '../types/benefit';

const API_URL = 'https://rt2ntcj19l.execute-api.us-east-1.amazonaws.com/prod';
const AI_SEARCH_URL = 'https://rt2ntcj19l.execute-api.us-east-1.amazonaws.com/prod/search';

interface FilterParams {
  category?: string;
  location?: string;
  affiliation?: string;
}

// Para filtros tradicionales
export const getFilteredBenefits = async (filters: FilterParams = {}): Promise<Benefit[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.category) {
      queryParams.append('category', filters.category);
    }

    const response = await fetch(`${API_URL}/benefits?${queryParams}`);
    if (!response.ok) throw new Error('Error al obtener beneficios');
    
    const benefits = await response.json();
    
    // Procesar los beneficios para asegurar que tengan todos los campos necesarios
    return processBenefits(benefits);
  } catch (error) {
    console.error('Error en filtros tradicionales:', error);
    throw error;
  }
};

// Para búsqueda AI
export const searchBenefitsAI = async (query: string, filters: FilterParams = {}): Promise<Benefit[]> => {
  try {
    const response = await fetch(AI_SEARCH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, filters })
    });

    if (!response.ok) throw new Error('Error en la búsqueda AI');
    
    const benefits = await response.json();
    
    // Procesar los beneficios para asegurar que tengan todos los campos necesarios
    return processBenefits(benefits);
  } catch (error) {
    console.error('Error en búsqueda AI:', error);
    throw error;
  }
};

export const getBenefits = async (): Promise<Benefit[]> => {
  const response = await axios.get<Benefit[]>(`${API_URL}/benefits`);
  return processBenefits(response.data);
};

// Función para procesar los beneficios y asegurar que tengan todos los campos necesarios
const processBenefits = (benefits: any[]): Benefit[] => {
  return benefits.map(benefit => ({
    ...benefit,
    // Asegurar que la ubicación esté definida (o será 'Sin ubicación' en los componentes)
    location: benefit.location || undefined
  }));
}; 