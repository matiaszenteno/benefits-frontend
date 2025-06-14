import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Benefit } from '../types/benefit';

interface HeroCarouselProps {
  benefits: Benefit[];
  onBenefitClick: (benefit: Benefit) => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ benefits, onBenefitClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [benefits.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % benefits.length);
  };

  if (benefits.length === 0) return null;

  const currentBenefit = benefits[currentIndex];
  const color = currentBenefit.color || 'from-purple-400 via-pink-400 to-blue-400';

  return (
    <div className="relative h-72 rounded-3xl overflow-hidden group shadow-2xl">
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-90`} />
      <img
        src={currentBenefit.imageUrl || currentBenefit.image_url || './placeholder.svg'}
        alt={currentBenefit.name}
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      />
      <div className="relative h-full p-8 flex items-center justify-between text-white">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-3">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-3 py-1">
              {currentBenefit.category}
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-3 py-1">
              Recomendado
            </Badge>
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-bold leading-tight">{currentBenefit.name}</h3>
            <p className="text-lg opacity-90 max-w-lg leading-relaxed">{currentBenefit.description}</p>
          </div>
          <Button
            onClick={() => onBenefitClick(currentBenefit)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold"
          >
            Ver detalles
          </Button>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold">{currentBenefit.discount || ''}</div>
          <div className="text-xl opacity-90">OFF</div>
        </div>
      </div>
      {/* Navigation */}
      <Button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        onClick={goToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {benefits.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel; 