import { useState, useEffect, useCallback } from 'react';
import { Benefit, BenefitsFilter } from '../types/benefit';
import { getBenefitsPaginated, searchBenefitsAI } from '../services/api';

interface BenefitChunk {
  startPage: number;
  endPage: number;
  benefits: Benefit[];
  total: number;
  totalPages: number;
}

interface UseBenefitsPrefetchReturn {
  benefits: Benefit[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  loading: boolean;
  prefetching: boolean;
  error: string | null;
  loadBenefits: (filters?: BenefitsFilter) => Promise<void>;
  searchAI: (query: string) => Promise<void>;
  goToPage: (page: number) => void;
  isPageCached: (page: number) => boolean;
}

const ITEMS_PER_PAGE = 12;
const PREFETCH_SIZE = 36; // 3 páginas de 12
const PAGES_PER_CHUNK = 3;

export const useBenefitsPrefetch = (): UseBenefitsPrefetchReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cache, setCache] = useState<Map<string, BenefitChunk>>(new Map());
  const [currentFilters, setCurrentFilters] = useState<BenefitsFilter>({});
  const [loading, setLoading] = useState(false);
  const [prefetching, setPrefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResults, setAiResults] = useState<Benefit[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Generar clave de cache para filtros
  const getCacheKey = (filters: BenefitsFilter): string => {
    return JSON.stringify({
      category: filters.category || '',
      is_active: filters.is_active !== undefined ? filters.is_active : true
    });
  };

  // Calcular qué chunk contiene una página específica
  const getChunkForPage = (page: number): number => {
    return Math.ceil(page / PAGES_PER_CHUNK);
  };

  // Obtener el rango de páginas de un chunk
  const getChunkPageRange = (chunkNumber: number): [number, number] => {
    const startPage = (chunkNumber - 1) * PAGES_PER_CHUNK + 1;
    const endPage = chunkNumber * PAGES_PER_CHUNK;
    return [startPage, endPage];
  };

  // Verificar si una página está en cache
  const isPageCached = useCallback((page: number): boolean => {
    if (isAIMode) return true; // AI results están todos en memoria
    
    const cacheKey = getCacheKey(currentFilters);
    const chunk = cache.get(cacheKey);
    
    if (!chunk) return false;
    
    return page >= chunk.startPage && page <= chunk.endPage;
  }, [cache, currentFilters, isAIMode]);

  // Cargar un chunk de datos del backend
  const loadChunk = async (chunkNumber: number, filters: BenefitsFilter, isPrefetch = false): Promise<void> => {
    const cacheKey = getCacheKey(filters);
    
    // Si ya está en cache, no recargar
    if (cache.has(cacheKey)) {
      const existingChunk = cache.get(cacheKey)!;
      const [chunkStart] = getChunkPageRange(chunkNumber);
      if (chunkStart >= existingChunk.startPage && chunkStart <= existingChunk.endPage) {
        // Actualizar totales incluso si no recargamos datos
        setTotalItems(existingChunk.total);
        setTotalPages(existingChunk.totalPages);
        return;
      }
    }

    try {
      if (isPrefetch) {
        setPrefetching(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [startPage] = getChunkPageRange(chunkNumber);
      
      const result = await getBenefitsPaginated({
        ...filters,
        page: chunkNumber, // Número de chunk como página
        limit: PREFETCH_SIZE,
        is_active: true
      });

      const newChunk: BenefitChunk = {
        startPage,
        endPage: Math.min(startPage + PAGES_PER_CHUNK - 1, Math.ceil(result.pagination.total / ITEMS_PER_PAGE)),
        benefits: result.data,
        total: result.pagination.total,
        totalPages: Math.ceil(result.pagination.total / ITEMS_PER_PAGE)
      };

      setCache(prev => new Map(prev.set(cacheKey, newChunk)));
      setTotalItems(result.pagination.total);
      setTotalPages(Math.ceil(result.pagination.total / ITEMS_PER_PAGE));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
      setPrefetching(false);
    }
  };

  // Obtener beneficios para la página actual desde cache
  const getCurrentPageBenefits = (): Benefit[] => {
    if (isAIMode) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return aiResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }

    const cacheKey = getCacheKey(currentFilters);
    const chunk = cache.get(cacheKey);
    
    if (!chunk) return [];

    const relativePageInChunk = currentPage - chunk.startPage;
    const startIndex = relativePageInChunk * ITEMS_PER_PAGE;
    
    return chunk.benefits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Prefetch del siguiente chunk si es necesario
  const prefetchNext = useCallback(async () => {
    if (isAIMode) return;

    const currentChunk = getChunkForPage(currentPage);
    const relativePageInChunk = ((currentPage - 1) % PAGES_PER_CHUNK) + 1;

    // Si estamos en la página 2 o 3 de un chunk, prefetch del siguiente
    if (relativePageInChunk >= 2) {
      const nextChunk = currentChunk + 1;
      const cacheKey = getCacheKey(currentFilters);
      
      // Verificar si el siguiente chunk ya está en cache
      const existingChunk = cache.get(cacheKey);
      if (existingChunk) {
        const [nextChunkStart] = getChunkPageRange(nextChunk);
        if (nextChunkStart <= existingChunk.endPage) {
          return; // Ya está en cache
        }
      }

      // Verificar si hay más páginas para cargar
      if (totalPages > currentChunk * PAGES_PER_CHUNK) {
        await loadChunk(nextChunk, currentFilters, true);
      }
    }
  }, [currentPage, currentFilters, cache, totalPages, isAIMode]);

  // Cargar beneficios (función principal)
  const loadBenefits = async (filters: BenefitsFilter = {}) => {
    // Limpiar cache si los filtros han cambiado
    const newCacheKey = getCacheKey(filters);
    const oldCacheKey = getCacheKey(currentFilters);
    
    if (newCacheKey !== oldCacheKey) {
      setCache(new Map());
    }
    
    setCurrentFilters(filters);
    setCurrentPage(1);
    setIsAIMode(false);
    setAiResults([]);
    
    const chunkNumber = getChunkForPage(1);
    await loadChunk(chunkNumber, filters, false);
  };

  // Búsqueda AI
  const searchAI = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      setIsAIMode(true);
      setCurrentPage(1);
      
      const results = await searchBenefitsAI(query);
      setAiResults(results);
      setTotalItems(results.length);
      setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setAiResults([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Navegar a página
  const goToPage = async (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    
    if (!isAIMode && !isPageCached(page)) {
      const chunkNumber = getChunkForPage(page);
      await loadChunk(chunkNumber, currentFilters, false);
    }
  };

  // Efecto para prefetch automático
  useEffect(() => {
    prefetchNext();
  }, [prefetchNext]);

  return {
    benefits: getCurrentPageBenefits(),
    currentPage,
    totalItems,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    loading,
    prefetching,
    error,
    loadBenefits,
    searchAI,
    goToPage,
    isPageCached
  };
}; 