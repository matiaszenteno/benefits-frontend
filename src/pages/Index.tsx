import { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Wifi } from 'lucide-react';
import BenefitCard from '../components/BenefitCard';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';
import { Button } from '../components/ui/button';
import { useBenefitsPrefetch } from '../hooks/useBenefitsPrefetch';
import { useDebounce } from '../hooks/useDebounce';
import HeroCarousel from '../components/HeroCarousel';
import { getCategories } from '../services/api';

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([]);
  const [filters, setFilters] = useState<{
    category: string;
    subcategory: string;
    affiliation: string;
    validDay?: string;
  }>({
    category: '',
    subcategory: '',
    affiliation: '',
    validDay: ''
  });

  const { 
    benefits, 
    currentPage, 
    totalItems, 
    totalPages, 
    hasNext, 
    hasPrev, 
    loading, 
    prefetching, 
    error, 
    loadBenefits, 
    searchAI, 
    goToPage
  } = useBenefitsPrefetch();
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Cargar primer chunk de beneficios (36 beneficios = 3 páginas)
        await loadBenefits({
          category: filters.category || undefined
        });
      } catch (error) {
        // Error silencioso, la UI manejará el estado de error
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Debounce para búsqueda en tiempo real
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Obtener proveedores únicos de los beneficios del backend (memoizado)
  const affiliations = useMemo(() => {
    if (!Array.isArray(benefits)) return [];
    return Array.from(new Set(benefits.filter(b => b.provider).map(b => b.provider as string))).sort();
  }, [benefits]);

  // Aplicar filtros locales solo para búsqueda de texto y filtros no soportados por backend
  const filteredBenefits = useMemo(() => {
    if (!Array.isArray(benefits)) return [];
    
    return benefits.filter(benefit => {
      const matchesSearch = !debouncedSearchTerm || 
                          benefit.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          benefit.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          benefit.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesSubcategory = !filters.subcategory || benefit.merchant_sub_category === filters.subcategory;
      const matchesAffiliation = !filters.affiliation || benefit.provider === filters.affiliation;
      const matchesDay = !filters.validDay || (benefit.validDays && benefit.validDays.includes(filters.validDay));

      return matchesSearch && matchesSubcategory && matchesAffiliation && matchesDay;
    });
  }, [debouncedSearchTerm, filters, benefits]);

  // Determinar si usar datos filtrados o del backend directo
  const shouldUseFilteredData = debouncedSearchTerm || filters.subcategory || filters.affiliation || filters.validDay;
  const displayBenefits = shouldUseFilteredData ? filteredBenefits : benefits;
  const displayTotalItems = shouldUseFilteredData ? filteredBenefits.length : totalItems;
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + displayBenefits.length - 1, displayTotalItems);

  // Removed the problematic useEffect that was causing multiple calls

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      affiliation: '',
      validDay: ''
    });
    setSearchTerm('');
    setIsAIMode(false);
    
    // Recargar datos desde el backend
    loadBenefits({});
  };

  const handleAISearch = () => {
    if (searchTerm.trim()) {
      setIsAIMode(true);
      searchAI(searchTerm);
    }
  };

  const handleGoToPage = (page: number) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = useCallback(async (category: string) => {
    // Actualizar solo el estado de filtros
    setFilters(prev => ({
      ...prev,
      category: category || ''
    }));
    setIsAIMode(false);
    setSearchTerm('');
    
    // Cargar beneficios con nuevo filtro - una sola llamada
    await loadBenefits({ category: category || undefined });
  }, [loadBenefits]);

  const handleSubcategoryFilter = useCallback((subcategory: string) => {
    setFilters(prev => ({
      ...prev,
      subcategory
    }));
    // No se recarga desde backend porque subcategory es filtro frontend
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Safe area top gradient for iOS notch/island */}
      <div style={{ height: 'env(safe-area-inset-top)' }} className="w-full bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 fixed top-0 left-0 z-50 pointer-events-none" />
      
      {/* Banner principal - tamaño consistente */}
      <div className="relative bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 pb-4 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isAIMode={isAIMode}
            onAIModeChange={setIsAIMode}
            onAISearch={handleAISearch}
            categories={categories}
            affiliations={affiliations}
            benefits={benefits}
            filters={filters}
            setFilters={setFilters}
          />
          
          {/* Carrusel solo cuando no está cargando inicialmente y hay elementos */}
          {!initialLoading && Array.isArray(benefits) && benefits.length > 0 && (
            <div className="mt-6 -mb-4 pb-4">
              <HeroCarousel benefits={benefits} />
            </div>
          )}
          
          {/* Espaciado pequeño siempre */}
          <div className="mt-4 mb-2" />
        </div>
      </div>
      {/* Resto del contenido (beneficios, etc.) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading and Error States */}
        {(loading || initialLoading) && (
          <>
            {/* Results info skeleton */}
            <div className="mb-4 flex justify-between items-center">
              <div className="bg-gray-200 h-4 w-48 rounded animate-pulse"></div>
            </div>
            
            {/* Skeleton cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 12 }, (_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error al cargar beneficios</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Benefits Grid */}
        {!loading && !initialLoading && !error && (
          <>
            {/* Results info */}
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <p className="text-gray-600 text-sm">
                  Mostrando {startIndex}-{endIndex} de {displayTotalItems} beneficios
                </p>
                {prefetching && (
                  <div className="flex items-center text-blue-500 text-xs">
                    <Wifi className="w-3 h-3 animate-pulse mr-1" />
                    Cargando más...
                  </div>
                )}
              </div>
              {(searchTerm || filters.category || filters.subcategory || filters.affiliation) && (
                <Button variant="outline" onClick={clearFilters} size="sm" className="text-xs">
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Mostrar mensaje cuando no hay beneficios */}
            {displayBenefits.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron beneficios</p>
              </div>
            )}

            {/* Quick Category Filters */}
            {!initialLoading && categories.length > 0 && !searchTerm && !isAIMode && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categorías populares</h3>
                <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                  <button
                    onClick={() => handleCategoryFilter('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      !filters.category 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        filters.category === category.name
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar beneficios cuando hay datos */}
            {displayBenefits.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {displayBenefits.map((benefit, idx) => (
                    <BenefitCard
                      key={benefit.id}
                      benefit={benefit}
                      index={idx}
                      onCategoryClick={handleCategoryFilter}
                      onSubcategoryClick={handleSubcategoryFilter}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoToPage(currentPage - 1)}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleGoToPage(pageNum)}
                            className={`w-10 ${
                              currentPage === pageNum 
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0" 
                                : ""
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoToPage(currentPage + 1)}
                      disabled={!hasNext}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index; 