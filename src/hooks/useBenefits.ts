import { useState } from 'react';
import { Benefit, PaginatedBenefitsResponse, BenefitsFilter } from '../types/benefit';
import { getBenefitsPaginated, searchBenefitsAI } from '../services/api';

interface UseBenefitsReturn {
  benefits: Benefit[];
  pagination: PaginatedBenefitsResponse['pagination'] | null;
  loading: boolean;
  error: string | null;
  loadBenefits: (filters?: BenefitsFilter) => Promise<void>;
  searchAI: (query: string) => Promise<void>;
  search: (query: string, filters?: { category?: string }, useAI?: boolean) => Promise<void>;
}

export const useBenefits = (): UseBenefitsReturn => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [pagination, setPagination] = useState<PaginatedBenefitsResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBenefits = async (filters: BenefitsFilter = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getBenefitsPaginated({
        ...filters,
        is_active: true // Solo mostrar beneficios activos por defecto
      });
      
      setBenefits(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setBenefits([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const searchAI = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await searchBenefitsAI(query);
      setBenefits(results);
      setPagination(null); // La búsqueda AI no usa paginación del backend
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setBenefits([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Mantener compatibilidad con la función search anterior
  const search = async (
    query: string,
    filters: { category?: string } = {},
    useAI: boolean = false
  ) => {
    if (useAI) {
      await searchAI(query);
    } else {
      await loadBenefits({
        category: filters.category,
        page: 1,
        limit: 12
      });
    }
  };

  return { benefits, pagination, loading, error, loadBenefits, searchAI, search };
}; 