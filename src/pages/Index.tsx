import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BenefitCard from '../components/BenefitCard';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';
import { Button } from '../components/ui/button';
import { useBenefits } from '../hooks/useBenefits';
import HeroCarousel from '../components/HeroCarousel';
import { getCategories } from '../services/api';

const ITEMS_PER_PAGE = 36;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const { benefits, loading, error, search } = useBenefits();
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Cargar beneficios
        await search('', filters, false);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Obtener proveedores únicos de los beneficios del backend
  const affiliations = useMemo(() => {
    if (!Array.isArray(benefits)) return [];
    return Array.from(new Set(benefits.filter(b => b.provider).map(b => b.provider as string))).sort();
  }, [benefits]);

  const filteredBenefits = useMemo(() => {
    if (!Array.isArray(benefits)) return [];
    
    // En modo AI, no aplicamos filtros de texto hasta que se ejecute la búsqueda AI
    if (isAIMode) {
      return benefits.filter(benefit => {
        const matchesCategory = !filters.category || benefit.category === filters.category;
        const matchesSubcategory = !filters.subcategory || benefit.merchant_sub_category === filters.subcategory;
        const matchesAffiliation = !filters.affiliation || benefit.provider === filters.affiliation;
        const matchesDay = !filters.validDay || (benefit.validDays && benefit.validDays.includes(filters.validDay));

        return matchesCategory && matchesSubcategory && matchesAffiliation && matchesDay;
      });
    }

    return benefits.filter(benefit => {
      const matchesSearch = !searchTerm || 
                          benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          benefit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          benefit.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || benefit.category === filters.category;
      const matchesSubcategory = !filters.subcategory || benefit.merchant_sub_category === filters.subcategory;
      const matchesAffiliation = !filters.affiliation || benefit.provider === filters.affiliation;
      const matchesDay = !filters.validDay || (benefit.validDays && benefit.validDays.includes(filters.validDay));

      return matchesSearch && matchesCategory && matchesSubcategory && matchesAffiliation && matchesDay;
    });
  }, [searchTerm, filters, isAIMode, benefits]);

  // Paginación
  const totalPages = Math.ceil(filteredBenefits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBenefits = filteredBenefits.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, isAIMode]);

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      affiliation: '',
      validDay: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleAISearch = () => {
    if (searchTerm.trim()) {
      search(searchTerm, filters, true);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          {!initialLoading && Array.isArray(benefits) && benefits.filter(benefit => benefit.is_carousel).length > 0 && (
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
              <p className="text-gray-600 text-sm">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredBenefits.length)} de {filteredBenefits.length} beneficios
              </p>
              {(searchTerm || filters.category || filters.subcategory || filters.affiliation) && (
                <Button variant="outline" onClick={clearFilters} size="sm" className="text-xs">
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Mostrar mensaje cuando no hay beneficios (solo si no está cargando) */}
            {filteredBenefits.length === 0 && !loading && !initialLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron beneficios</p>
              </div>
            )}

            {/* Mostrar beneficios cuando hay datos */}
            {filteredBenefits.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {currentBenefits.map((benefit, idx) => (
                    <BenefitCard
                      key={benefit.id}
                      benefit={benefit}
                      index={idx}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
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
                            onClick={() => goToPage(pageNum)}
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
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
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