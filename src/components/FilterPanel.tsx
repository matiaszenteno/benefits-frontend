import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Building, Tag } from 'lucide-react';

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
  affiliations
}) => {
  const updateFilter = (key: string, value: string) => {
    // Convert placeholder values back to empty strings for our filter logic
    const actualValue = value === 'all' ? '' : value;
    setFilters(prev => ({ ...prev, [key]: actualValue }));
  };

  // Convert empty strings to placeholder values for the Select components
  const getSelectValue = (filterValue: string) => filterValue || 'all';

  return (
    <div className="mb-6 bg-white/90 shadow-lg rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center">
            <Tag className="w-4 h-4 mr-2 text-purple-500" />
            Categoría
          </label>
          <Select
            value={getSelectValue(filters.category)}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 shadow rounded-xl">
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
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            Ubicación
          </label>
          <Select
            value={getSelectValue(filters.location)}
            onValueChange={(value) => updateFilter('location', value)}
          >
            <SelectTrigger className="border-0 bg-gradient-to-r from-blue-50 to-cyan-50 shadow rounded-xl">
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

        {/* Provider Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center">
            <Building className="w-4 h-4 mr-2 text-green-500" />
            Proveedor
          </label>
          <Select
            value={getSelectValue(filters.affiliation)}
            onValueChange={(value) => updateFilter('affiliation', value)}
          >
            <SelectTrigger className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow rounded-xl">
              <SelectValue placeholder="Todos los proveedores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proveedores</SelectItem>
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