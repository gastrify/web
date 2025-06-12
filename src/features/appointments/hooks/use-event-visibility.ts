import { useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";

interface EventVisibilityOptions {
  eventHeight: number;
  eventGap: number;
}

interface EventVisibilityResult {
  contentRef: React.RefObject<HTMLDivElement>;
  contentHeight: number | null;
  getVisibleEventCount: (totalEvents: number) => number;
}

/**
 * Hook for calculating event visibility based on container height
 * Uses ResizeObserver for efficient updates
 */
export function useEventVisibility({
  eventHeight,
  eventGap,
}: EventVisibilityOptions): EventVisibilityResult {
  // Use the standard pattern for React refs
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.clientHeight);
    }
  }, []);

  // Use layout effect for synchronous measurement before paint
  useLayoutEffect(() => {
    if (!contentRef.current) return;

    updateHeight();

    // Create observer only once and reuse it
    if (!observerRef.current) {
      observerRef.current = new ResizeObserver(() => {
        updateHeight();
      });
    }

    observerRef.current.observe(contentRef.current);

    // Clean up function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [updateHeight]);

  // Function to calculate visible events for a cell
  const getVisibleEventCount = useMemo(() => {
    return (totalEvents: number): number => {
      if (!contentHeight) return totalEvents;

      // Calculate how many events can fit in the container
      const maxEvents = Math.floor(contentHeight / (eventHeight + eventGap));

      // If all events fit, show them all
      if (totalEvents <= maxEvents) {
        return totalEvents;
      } else {
        // Otherwise, reserve space for "more" button by showing one less
        return maxEvents > 0 ? maxEvents - 1 : 0;
      }
    };
  }, [contentHeight, eventHeight, eventGap]);

  // Use type assertion to satisfy TypeScript
  return {
    contentRef,
    contentHeight,
    getVisibleEventCount,
  } as EventVisibilityResult;
}
