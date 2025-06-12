import { useState } from 'react';
import { Benefit } from '../types/benefit';
import { getFilteredBenefits, searchBenefitsAI } from '../services/api';

interface UseBenefitsReturn {
  benefits: Benefit[];
  loading: boolean;
  error: string | null;
  search: (
    query: string,
    filters: Record<string, any> = {},
    useAI: boolean = false,
    userInterest?: string
  ) => Promise<void>;
}

export const useBenefits = (): UseBenefitsReturn => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    query: string,
    filters: Record<string, any> = {},
    useAI: boolean = false,
    userInterest?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      let results: Benefit[];
      if (useAI) {
        results = await searchBenefitsAI(query, filters, userInterest);
      } else {
        results = await getFilteredBenefits(filters);
      }

      setBenefits(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return {
    benefits,
    loading,
    error,
    search
  };
}; 