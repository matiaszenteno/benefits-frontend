import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Building } from 'lucide-react';
import { Benefit } from '../types/benefit';

interface BenefitCardProps {
  benefit: Benefit;
  onClick: () => void;
  index: number;
}

const CARD_GRADIENTS = [
  'from-purple-100 via-pink-100 to-blue-100',
  'from-blue-100 via-cyan-100 to-green-100',
  'from-pink-100 via-yellow-100 to-orange-100',
  'from-green-100 via-teal-100 to-blue-100',
  'from-yellow-100 via-pink-100 to-purple-100',
];

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, onClick, index }) => {
  const location = benefit.location || 'Sin ubicación';
  const color = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 overflow-hidden bg-white bg-gradient-to-br ${color}`}
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={benefit.imageUrl || benefit.image_url || './placeholder.svg'}
          alt={benefit.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 filter grayscale"
        />
        <div className="absolute top-4 right-4">
          <Badge
            className={`bg-gradient-to-r ${color} text-gray-900 font-bold px-4 py-2 text-sm shadow-lg border border-white/50`}
          >
            {benefit.discount || 'Descuento'} OFF
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 px-3 py-1">{benefit.category}</Badge>
        </div>
      </div>
      <div className={`p-6 bg-gradient-to-br ${color} space-y-4`}>
        <h3 className="font-bold text-xl leading-tight text-gray-900 group-hover:text-gray-800 transition-colors">
          {benefit.name}
        </h3>
        <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">{benefit.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{benefit.provider}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BenefitCard; 