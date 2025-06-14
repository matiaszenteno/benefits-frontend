import { useState } from 'react';
import { Benefit } from '../types/benefit';
import { getFilteredBenefits, searchBenefitsAI } from '../services/api';

interface UseBenefitsReturn {
  benefits: Benefit[];
  loading: boolean;
  error: string | null;
  search: (query: string, filters?: { category?: string }, useAI?: boolean) => Promise<void>;
}

export const useBenefits = (): UseBenefitsReturn => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    query: string,
    filters: { category?: string } = {},
    useAI: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      const results = useAI 
        ? await searchBenefitsAI(query)
        : await getFilteredBenefits(filters);
      setBenefits(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return { benefits, loading, error, search };
}; 