import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isAIMode: boolean;
  onAIModeChange: (enabled: boolean) => void;
  onAISearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  isAIMode,
  onAIModeChange,
  onAISearch
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAIMode) {
      onAISearch();
    }
  };

  return (
    <div className="flex gap-3 items-center">
      {/* AI Toggle Button */}
      <Button
        variant={isAIMode ? "default" : "outline"}
        size="sm"
        onClick={() => onAIModeChange(!isAIMode)}
        className={`flex-shrink-0 p-2 transition-all duration-200 ${
          isAIMode 
            ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-200' 
            : 'border-violet-200 hover:border-violet-300 hover:bg-violet-50'
        }`}
      >
        <Sparkles className="w-4 h-4" />
      </Button>

      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={isAIMode ? "Describe lo que buscas en lenguaje natural..." : "Buscar beneficios..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`pl-10 transition-all duration-200 ${
            isAIMode 
              ? 'border-purple-300 focus:border-purple-500 focus:ring-purple-500 bg-purple-50/50 placeholder:text-purple-400' 
              : 'border-violet-200 focus:border-violet-400 focus:ring-violet-400 hover:border-violet-300'
          }`}
        />
      </div>
    </div>
  );
};

export default SearchBar; 