import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Building } from 'lucide-react';
import { Benefit } from '../types/benefit';

interface BenefitCardProps {
  benefit: Benefit;
  onClick: () => void;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, onClick }) => {
  // Si no hay ubicación, mostrar "Sin ubicación"
  const location = benefit.location || 'Sin ubicación';

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-violet-200/50 hover:-translate-y-2 border-violet-100 overflow-hidden group bg-gradient-to-br from-white to-violet-50/30"
      onClick={onClick}
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={benefit.imageUrl || './placeholder.svg'}
          alt={benefit.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-foreground text-xs font-medium border border-white/50 shadow-sm">
            {benefit.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-violet-600 transition-colors leading-tight">
          {benefit.name}
        </h3>
        
        <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
          {benefit.description}
        </p>

        <div className="space-y-1 pt-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 mr-1 text-violet-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          
          {benefit.provider && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Building className="w-3 h-3 mr-1 text-fuchsia-500 flex-shrink-0" />
              <span className="truncate">{benefit.provider}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BenefitCard; 