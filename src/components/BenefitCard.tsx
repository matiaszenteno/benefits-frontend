import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Building } from 'lucide-react';
import { Benefit } from '../types/benefit';

interface BenefitCardProps {
  benefit: Benefit;
  index: number;
  onCategoryClick?: (category: string) => void;
  onSubcategoryClick?: (subcategory: string) => void;
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

const BenefitCard: React.FC<BenefitCardProps> = ({ 
  benefit, 
  index, 
  onCategoryClick, 
  onSubcategoryClick 
}) => {
  const color = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  const handleVisitBenefit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (benefit.source_url) {
      window.open(benefit.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCategoryClick) {
      onCategoryClick(benefit.category);
    }
  };

  const handleSubcategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSubcategoryClick && benefit.merchant_sub_category) {
      onSubcategoryClick(benefit.merchant_sub_category);
    }
  };

  return (
    <Card
      className={`group transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 overflow-hidden bg-white bg-gradient-to-br ${color} flex flex-col h-full`}
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
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <Badge 
            className="bg-black/70 backdrop-blur-sm text-white border-0 px-3 py-1 w-fit hover:bg-gradient-to-r hover:from-purple-200/90 hover:to-pink-200/90 hover:text-gray-800 transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={handleCategoryClick}
            title={`Filtrar por categoría: ${benefit.category}`}
          >
            {benefit.category}
          </Badge>
          {benefit.merchant_sub_category && benefit.merchant_sub_category !== benefit.category && (
            <Badge 
              className="bg-black/50 backdrop-blur-sm text-white/90 border-0 px-2 py-0.5 text-xs w-fit hover:bg-gradient-to-r hover:from-purple-200/80 hover:to-pink-200/80 hover:text-gray-700 transition-all duration-200 cursor-pointer hover:scale-105"
              onClick={handleSubcategoryClick}
              title={`Filtrar por subcategoría: ${benefit.merchant_sub_category}`}
            >
              {benefit.merchant_sub_category}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 bg-transparent">
        <div className="flex flex-col" style={{ minHeight: '90px' }}>
          <h3 className="font-bold text-xl leading-tight text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-3 mb-2">
            {benefit.name}
          </h3>
          <p className="text-gray-800 text-sm leading-relaxed line-clamp-2 mb-2">
            {benefit.description}
          </p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-between text-sm text-gray-700 border-t border-white/30 mt-2 min-h-[36px] py-2">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{benefit.provider}</span>
          </div>
          {benefit.source_url && (
            <button
              onClick={handleVisitBenefit}
              className="text-gray-700 hover:text-gray-900 text-xs font-medium underline decoration-1 underline-offset-2 flex items-center space-x-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Visitar beneficio</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BenefitCard; 