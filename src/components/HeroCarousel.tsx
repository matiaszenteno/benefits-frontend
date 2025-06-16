import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Benefit } from '../types/benefit';

interface HeroCarouselProps {
  benefits: Benefit[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ benefits }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtrar solo beneficios marcados para carrusel
  const carouselBenefits = benefits.filter(benefit => benefit.is_carousel);

  const defaultImages = [
    'https://assets.bancochile.cl/uploads/000/058/511/e4d4668a-e8bd-4da6-9348-c39f1488cd43/original/banner-web-DO-SUSHI.jpg',
    'https://assets.bancochile.cl/uploads/000/056/680/e18e3ccc-fb95-4100-aa66-2f42e2b8741a/original/banner-web-Prima-Bar.jpg',
  ];

  useEffect(() => {
    if (carouselBenefits.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselBenefits.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselBenefits.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselBenefits.length) % carouselBenefits.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselBenefits.length);
  };

  const handleCarouselClick = () => {
    const currentBenefit = carouselBenefits[currentIndex];
    if (currentBenefit?.source_url) {
      window.open(currentBenefit.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (carouselBenefits.length === 0) return null;

  const currentBenefit = carouselBenefits[currentIndex];

  return (
    <div 
      className="relative h-40 sm:h-72 rounded-3xl overflow-hidden group shadow-2xl cursor-pointer"
      onClick={handleCarouselClick}
    >
      <img
        src={currentBenefit.carousel_image_url || currentBenefit.imageUrl || currentBenefit.image_url || defaultImages[currentIndex % 2]}
        alt={currentBenefit.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Description overlay */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg max-w-xs">
        <p className="text-sm font-medium line-clamp-2">
          {currentBenefit.description}
        </p>
      </div>
      
      {/* Navigation */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 right-6 flex space-x-2">
        {carouselBenefits.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel; 