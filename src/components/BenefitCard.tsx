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
  'from-purple-200/30 to-pink-200/30',
  'from-blue-200/30 to-purple-200/30',
  'from-pink-200/30 to-blue-200/30',
];

const CARD_IMAGES = [
  'https://assets.bancochile.cl/uploads/000/026/718/46104d3f-2da3-4f04-94db-c3b58ea8030f/original/banner-web-lounge.jpg',
  'https://assets.bancochile.cl/uploads/000/043/324/7bad47cb-9618-47f7-95d9-cf0bd8a4666d/original/banner-web-Taringa.jpg',
  'https://assets.bancochile.cl/uploads/000/042/547/beb95cb3-b7b1-421f-a33c-f5a1b6a60d27/original/banner-web-Rally-Kart.jpg',
  'https://assets.bancochile.cl/uploads/000/026/819/f634857a-7aa5-4ce0-81aa-31a7ae569dc3/original/Wendys_Sept22-212.jpg',
];

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit, onClick, index }) => {
  const location = benefit.location || 'Sin ubicación';
  const color = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 overflow-hidden bg-white bg-gradient-to-br ${color} flex flex-col h-full`}
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={
            benefit.imageUrl ||
            benefit.image_url ||
            CARD_IMAGES[index % CARD_IMAGES.length]
          }
          alt={benefit.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 px-3 py-1">{benefit.category}</Badge>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 bg-transparent">
        <div className="flex flex-col" style={{ minHeight: '120px' }}>
          <h3 className="font-bold text-xl leading-tight text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-3 mb-2">
            {benefit.name}
          </h3>
          <p className="text-gray-800 text-sm leading-relaxed line-clamp-3 mb-2">
            {benefit.description}
          </p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-between text-sm text-gray-700 border-t border-white/30 mt-2 min-h-[36px] py-1">
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