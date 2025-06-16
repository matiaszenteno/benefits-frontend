import React from 'react';
import { Card } from './ui/card';

const SkeletonCard: React.FC = () => {
  return (
    <Card className="group transition-all duration-300 border-0 overflow-hidden bg-white bg-gradient-to-br from-purple-200/30 to-pink-200/30 flex flex-col h-full animate-pulse">
      <div className="relative h-48 bg-gray-200">
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <div className="bg-gray-300 h-6 w-20 rounded"></div>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 bg-transparent">
        <div className="flex flex-col" style={{ minHeight: '90px' }}>
          <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 w-full rounded mb-1"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-between text-sm border-t border-white/30 mt-2 min-h-[36px] py-2">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-300 h-4 w-4 rounded"></div>
            <div className="bg-gray-300 h-4 w-16 rounded"></div>
          </div>
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
        </div>
      </div>
    </Card>
  );
};

export default SkeletonCard; 