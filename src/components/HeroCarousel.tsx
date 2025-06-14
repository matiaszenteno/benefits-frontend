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

  const defaultImages = [
    'https://assets.bancochile.cl/uploads/000/058/511/e4d4668a-e8bd-4da6-9348-c39f1488cd43/original/banner-web-DO-SUSHI.jpg',
    'https://assets.bancochile.cl/uploads/000/056/680/e18e3ccc-fb95-4100-aa66-2f42e2b8741a/original/banner-web-Prima-Bar.jpg',
  ];

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
    <div className="relative h-40 sm:h-72 rounded-3xl overflow-hidden group shadow-2xl">
      <img
        src={currentBenefit.imageUrl || currentBenefit.image_url || defaultImages[currentIndex % 2]}
        alt={currentBenefit.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
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