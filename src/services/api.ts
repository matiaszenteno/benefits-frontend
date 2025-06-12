import axios from 'axios';
import { Benefit } from '../types/benefit';

const API_URL = 'https://tu-api-gateway.execute-api.us-east-1.amazonaws.com/prod';

interface FilterParams {
  bank?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

// Para filtros tradicionales (frontend)
export const getFilteredBenefits = async (filters: FilterParams = {}): Promise<Benefit[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_URL}/benefits?${queryParams}`);

    if (!response.ok) {
      throw new Error('Error al obtener beneficios');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en filtros tradicionales:', error);
    throw error;
  }
};

// Para búsqueda AI (usa n8n)
export const searchBenefitsAI = async (query: string, filters: FilterParams = {}, userInterest?: string): Promise<Benefit[]> => {
  try {
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        filters,
        useAI: true,
        userInterest
      })
    });

    if (!response.ok) {
      throw new Error('Error en la búsqueda AI');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en búsqueda AI:', error);
    throw error;
  }
};

export interface Benefit {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export const getBenefits = async (): Promise<Benefit[]> => {
  const response = await axios.get<Benefit[]>(API_URL);
  return response.data;
}; 