import { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import BenefitCard from '../components/BenefitCard';
import BenefitModal from '../components/BenefitModal';
import SearchBar from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { useBenefits } from '../hooks/useBenefits';
import { Benefit } from '../types/benefit';
import HeroCarousel from '../components/HeroCarousel';

const Index = () => {
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const [filters, setFilters] = useState<{
    category: string;
    location: string;
    affiliation: string;
    validDay?: string;
  }>({
    category: '',
    location: '',
    affiliation: '',
    validDay: ''
  });

  const { benefits, loading, error, search } = useBenefits();
  
  // Cargar beneficios al inicio
  useEffect(() => {
    search('', filters, false);
  }, []);

  // Obtener categorías, ubicaciones y proveedores únicos de los beneficios del backend
  const categories = useMemo(() => 
    Array.from(new Set(benefits.map(b => b.category).filter(Boolean))).sort(),
    [benefits]
  );
  
  const locations = useMemo(() => 
    Array.from(new Set(benefits.filter(b => b.location && b.location.trim() !== '' && b.location !== 'Sin ubicación').map(b => b.location as string))).sort(),
    [benefits]
  );
  
  const affiliations = useMemo(() => 
    Array.from(new Set(benefits.filter(b => b.provider).map(b => b.provider as string))).sort(),
    [benefits]
  );

  const filteredBenefits = useMemo(() => {
    // En modo AI, no aplicamos filtros de texto hasta que se ejecute la búsqueda AI
    if (isAIMode) {
      return benefits.filter(benefit => {
        const matchesCategory = !filters.category || benefit.category === filters.category;
        const matchesLocation = !filters.location || benefit.location === filters.location;
        const matchesAffiliation = !filters.affiliation || benefit.provider === filters.affiliation;
        const matchesDay = !filters.validDay || (benefit.validDays && benefit.validDays.includes(filters.validDay));

        return matchesCategory && matchesLocation && matchesAffiliation && matchesDay;
      });
    }

    return benefits.filter(benefit => {
      const matchesSearch = !searchTerm || 
                          benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          benefit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          benefit.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || benefit.category === filters.category;
      const matchesLocation = !filters.location || benefit.location === filters.location;
      const matchesAffiliation = !filters.affiliation || benefit.provider === filters.affiliation;
      const matchesDay = !filters.validDay || (benefit.validDays && benefit.validDays.includes(filters.validDay));

      return matchesSearch && matchesCategory && matchesLocation && matchesAffiliation && matchesDay;
    });
  }, [searchTerm, filters, isAIMode, benefits]);

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      affiliation: '',
      validDay: ''
    });
    setSearchTerm('');
  };

  const handleAISearch = () => {
    if (searchTerm.trim()) {
      search(searchTerm, filters, true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Banner + Hero Carousel + Search/Filtros sticky */}
      <div className="relative">
        {/* Banner gradiente y carrusel */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 pb-8 rounded-b-3xl shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <HeroCarousel benefits={benefits.slice(0, 5)} onBenefitClick={setSelectedBenefit} />
          </div>
        </div>
        {/* Barra de búsqueda y filtros sticky */}
        <div className="sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="-mt-12">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isAIMode={isAIMode}
                onAIModeChange={setIsAIMode}
                onAISearch={handleAISearch}
                categories={categories}
                locations={locations}
                affiliations={affiliations}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Resto del contenido (beneficios, etc.) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando beneficios...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error al cargar beneficios</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Benefits Grid */}
        {!loading && !error && (
          <>
            {filteredBenefits.length === 0 ? (
              <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl border border-violet-100">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No se encontraron beneficios</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  No hay beneficios que coincidan con tu búsqueda o filtros. Intenta con otros términos o limpia los filtros.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBenefits.map((benefit) => (
                  <BenefitCard
                    key={benefit.id}
                    benefit={benefit}
                    onClick={() => setSelectedBenefit(benefit)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Benefit Modal */}
      {selectedBenefit && (
        <BenefitModal
          benefit={selectedBenefit}
          isOpen={!!selectedBenefit}
          onClose={() => setSelectedBenefit(null)}
        />
      )}
    </div>
  );
};

export default Index; 