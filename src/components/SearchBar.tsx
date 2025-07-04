import React, { useCallback, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Category {
  id: number;
  name: string;
}

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isAIMode: boolean;
  onAIModeChange: (enabled: boolean) => void;
  onAISearch: () => void;
  categories: Category[];
  affiliations: string[];
  benefits: any[];
  filters: {
    category: string;
    subcategory: string;
    affiliation: string;
    validDay?: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    subcategory: string;
    affiliation: string;
    validDay?: string;
  }>>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  isAIMode,
  onAIModeChange,
  onAISearch,
  categories,
  affiliations,
  benefits,
  filters,
  setFilters
}) => {
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAIMode) {
      onAISearch();
    }
  }, [isAIMode, onAISearch]);

  const updateFilter = useCallback((key: string, value: string) => {
    const newValue = value === 'all' ? '' : value;
    
    // Si se cambia la categoría, resetear subcategoría
    if (key === 'category') {
      setFilters(prev => ({ 
        ...prev, 
        [key]: newValue,
        subcategory: '' // Reset subcategory when category changes
      }));
    } else {
      setFilters(prev => ({ ...prev, [key]: newValue }));
    }
  }, [setFilters]);

  // Optimizar con useMemo - solo recalcular cuando cambie la categoría o benefits
  const availableSubcategories = useMemo(() => {
    if (!filters.category || !Array.isArray(benefits)) return [];
    
    return Array.from(new Set(
      benefits
        .filter(benefit => benefit.category === filters.category && benefit.merchant_sub_category)
        .map(benefit => benefit.merchant_sub_category)
    )).sort().map((name, index) => ({ id: index, name }));
  }, [filters.category, benefits]);

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-center w-full max-w-7xl mx-auto overflow-hidden">
      {/* Search Bar */}
      <div className="flex-1 min-w-0 relative w-full max-w-full overflow-hidden">
        <div className="relative flex items-center w-full">
          <Button
            onClick={() => onAIModeChange(!isAIMode)}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 h-7 px-2 rounded-lg transition-all z-10 ${
              isAIMode
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
            style={{ marginRight: '8px' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
          <Search className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Input
            placeholder={isAIMode ? "Describe lo que buscas... ej: 'cena romántica en Las Condes'" : "Buscar por nombre del beneficio..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`pl-16 pr-4 h-11 border-0 shadow-lg rounded-xl transition-all text-base w-full ${
              isAIMode
                ? "bg-gradient-to-r from-purple-50 to-pink-50 focus:from-purple-100 focus:to-pink-100"
                : "bg-white/95 backdrop-blur-sm focus:bg-white"
            }`}
          />
        </div>
      </div>
      {/* Filters */}
      <div className="flex gap-2 w-full lg:w-auto justify-center flex-shrink-0 mt-2 lg:mt-0 overflow-x-auto scrollbar-thin">
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => updateFilter('category', value)}
        >
          <SelectTrigger className="w-44 h-11 border-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl text-sm">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={filters.subcategory || 'all'}
          onValueChange={(value) => updateFilter('subcategory', value)}
          disabled={!filters.category}
        >
          <SelectTrigger className={`w-44 h-11 border-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl text-sm ${
            !filters.category ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            <SelectValue placeholder="Subcategoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {availableSubcategories.map((subcategory) => (
              <SelectItem key={subcategory.id} value={subcategory.name}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={filters.affiliation || 'all'}
          onValueChange={(value) => updateFilter('affiliation', value)}
        >
          <SelectTrigger className="w-44 h-11 border-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl text-sm">
            <SelectValue placeholder="Afiliación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {affiliations.map((aff) => (
              <SelectItem key={aff} value={aff}>
                {aff}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchBar; 