import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Benefit } from '../types/benefit';

interface HeroCarouselProps {
  benefits: Benefit[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ benefits }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [offset, setOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filtrar solo beneficios marcados para carrusel, o usar los primeros 3 como fallback
  const carouselBenefits = Array.isArray(benefits) ? 
    benefits.filter(benefit => benefit.is_carousel).length > 0 
      ? benefits.filter(benefit => benefit.is_carousel)
      : benefits.slice(0, 3) // Mostrar los primeros 3 beneficios si no hay carrusel específico
    : [];

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

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselBenefits.length) % carouselBenefits.length);
  }, [carouselBenefits.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselBenefits.length);
  }, [carouselBenefits.length]);

  // Touch/Mouse handlers para gestos
  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setOffset(0);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX;
    setCurrentX(clientX);
    setOffset(deltaX);
  }, [isDragging, startX]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    const deltaX = currentX - startX;
    const threshold = 30; // Threshold más sensible para mobile
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    setIsDragging(false);
    setOffset(0);
  }, [isDragging, currentX, startX, goToPrevious, goToNext]);

  // Touch events optimizados para mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation(); // Prevenir que el evento se propague al parent
    handleStart(e.touches[0].clientX);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault(); // Solo prevenir scroll si estamos arrastrando
      e.stopPropagation();
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove, isDragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    handleEnd();
  }, [handleEnd]);

  // Mouse events (para trackpad y desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCarouselClick = useCallback(() => {
    // Solo abrir si no estamos arrastrando
    if (!isDragging) {
      const currentBenefit = carouselBenefits[currentIndex];
      if (currentBenefit?.source_url) {
        window.open(currentBenefit.source_url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [isDragging, carouselBenefits, currentIndex]);

  if (carouselBenefits.length === 0) return null;

  const currentBenefit = carouselBenefits[currentIndex];

  return (
    <div 
      ref={carouselRef}
      className={`relative h-40 sm:h-72 rounded-3xl overflow-hidden group shadow-2xl cursor-pointer select-none touch-pan-y ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onClick={handleCarouselClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{ touchAction: 'pan-y' }} // Permitir scroll vertical, manejar horizontal nosotros
    >
      <img
        src={currentBenefit.carousel_image_url || currentBenefit.imageUrl || currentBenefit.image_url || defaultImages[currentIndex % 2]}
        alt={currentBenefit.name}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
          isDragging ? 'pointer-events-none' : ''
        }`}
        style={{
          transform: `translateX(${offset * 0.1}px)`, // Sutil efecto de arrastre
        }}
        draggable={false}
      />
      
      {/* Description overlay */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg max-w-xs">
        {currentBenefit.provider && (
          <p className="text-xs font-bold text-yellow-300 mb-1">
            {currentBenefit.provider}
          </p>
        )}
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