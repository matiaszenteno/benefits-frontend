import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, MapPin, Building, Tag } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    category: string;
    location: string;
    affiliation: string;
    validDay: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    location: string;
    affiliation: string;
    validDay: string;
  }>>;
  categories: string[];
  locations: string[];
  affiliations: string[];
  days: string[];
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  categories,
  locations,
  affiliations,
  onClose,
}) => {
  const updateFilter = (key: string, value: string) => {
    // Convert placeholder values back to empty strings for our filter logic
    const actualValue = value === 'all' ? '' : value;
    setFilters(prev => ({ ...prev, [key]: actualValue }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      location: '',
      affiliation: '',
      validDay: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Convert empty strings to placeholder values for the Select components
  const getSelectValue = (filterValue: string) => filterValue || 'all';

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {activeFiltersCount} activos
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            disabled={activeFiltersCount === 0}
          >
            Limpiar todo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Tag className="w-4 h-4 mr-2 text-purple-500" />
            Categoría
          </label>
          <Select
            value={getSelectValue(filters.category)}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger className="border-purple-200 focus:border-purple-400">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            Ubicación
          </label>
          <Select
            value={getSelectValue(filters.location)}
            onValueChange={(value) => updateFilter('location', value)}
          >
            <SelectTrigger className="border-purple-200 focus:border-purple-400">
              <SelectValue placeholder="Todas las ubicaciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ubicaciones</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Affiliation Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Building className="w-4 h-4 mr-2 text-green-500" />
            Afiliación
          </label>
          <Select
            value={getSelectValue(filters.affiliation)}
            onValueChange={(value) => updateFilter('affiliation', value)}
          >
            <SelectTrigger className="border-purple-200 focus:border-purple-400">
              <SelectValue placeholder="Todas las afiliaciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las afiliaciones</SelectItem>
              {affiliations.map((affiliation) => (
                <SelectItem key={affiliation} value={affiliation}>
                  {affiliation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 