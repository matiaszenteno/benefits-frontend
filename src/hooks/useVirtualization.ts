import { useState, useCallback, useMemo } from 'react';

interface UseVirtualizationProps {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
  overscan?: number;
}

interface VirtualizationResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number[];
  totalHeight: number;
  offsetY: number;
}

export function useVirtualization({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 2
}: UseVirtualizationProps): VirtualizationResult {
  const [scrollTop] = useState(0);

  // const handleScroll = useCallback((e: Event) => {
  //   const target = e.target as HTMLElement;
  //   setScrollTop(target.scrollTop);
  // }, []);

  const { startIndex, endIndex, visibleItems, totalHeight, offsetY } = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + overscan, itemCount);
    const actualStart = Math.max(0, start - overscan);

    const items = [];
    for (let i = actualStart; i < end; i++) {
      items.push(i);
    }

    return {
      startIndex: actualStart,
      endIndex: end,
      visibleItems: items,
      totalHeight: itemCount * itemHeight,
      offsetY: actualStart * itemHeight
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY
  };
}

// Hook simplificado para casos donde no necesitamos virtualización completa
export function useSimpleVirtualization(items: any[], pageSize: number = 12) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + pageSize, items.length));
  }, [items.length, pageSize]);

  const hasMore = visibleCount < items.length;

  return {
    visibleItems,
    loadMore,
    hasMore,
    visibleCount,
    totalCount: items.length
  };
} 