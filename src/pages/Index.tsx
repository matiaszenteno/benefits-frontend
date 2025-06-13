import { useState, useMemo, useEffect } from 'react';
import { Filter, Star, Users } from 'lucide-react';
import BenefitCard from '../components/BenefitCard';
import BenefitModal from '../components/BenefitModal';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { useBenefits } from '../hooks/useBenefits';
import { Benefit } from '../types/benefit';

const Index = () => {
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [filters, setFilters] = useState({
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

  // Obtener categorías, ubicaciones y afiliaciones únicas de los beneficios
  const categories = useMemo(() => 
    Array.from(new Set(benefits.map(b => b.category))),
    [benefits]
  );
  
  const locations = useMemo(() => 
    Array.from(new Set(benefits.filter(b => b.location).map(b => b.location as string))),
    [benefits]
  );
  
  const affiliations = useMemo(() => 
    Array.from(new Set(benefits.filter(b => b.affiliation).map(b => b.affiliation as string))),
    [benefits]
  );
  
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const filteredBenefits = useMemo(() => {
    // En modo AI, no aplicamos filtros de texto hasta que se ejecute la búsqueda AI
    if (isAIMode) {
      return benefits.filter(benefit => {
        const matchesCategory = !filters.category || benefit.category === filters.category;
        const matchesLocation = !filters.location || benefit.location === filters.location;
        const matchesAffiliation = !filters.affiliation || benefit.affiliation === filters.affiliation;
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
      const matchesAffiliation = !filters.affiliation || benefit.affiliation === filters.affiliation;
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
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-300 sticky top-0 z-40 shadow-lg shadow-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                Beneficios
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
        <div className="mb-8 space-y-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isAIMode={isAIMode}
            onAIModeChange={setIsAIMode}
            onAISearch={handleAISearch}
          />

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-violet-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            {/* Benefits Counter */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-200">
              <Users className="w-4 h-4 text-violet-500" />
              <span className="hidden sm:inline font-medium">{filteredBenefits.length} beneficios disponibles</span>
              <span className="sm:hidden font-medium">{filteredBenefits.length}</span>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              locations={locations}
              affiliations={affiliations}
              days={days}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>

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