import React, { useEffect, useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { resolveFoodImage } from '../assets/images';

export const FlyToCartOverlay: React.FC = () => {
  const { flyingItem, cartIconRef } = useRestaurant();
  const [animating, setAnimating] = useState(false);
  const [coords, setCoords] = useState<{
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!flyingItem) {
      setCoords(null);
      setAnimating(false);
      return;
    }

    // Calculate cart target position (top-right navbar cart icon or fallback)
    let targetX = window.innerWidth - 60;
    let targetY = 40;

    if (cartIconRef.current) {
      const rect = cartIconRef.current.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // Step 1: Set starting position with animating: false
    setCoords({
      startX: flyingItem.startX,
      startY: flyingItem.startY,
      targetX,
      targetY,
      imageUrl: flyingItem.imageUrl,
    });
    setAnimating(false);

    // Step 2: Trigger transition to target on next browser paint
    const timer = setTimeout(() => {
      setAnimating(true);
    }, 40);

    return () => clearTimeout(timer);
  }, [flyingItem, cartIconRef]);

  if (!coords) return null;

  const currentX = animating ? coords.targetX : coords.startX;
  const currentY = animating ? coords.targetY : coords.startY;
  const scale = animating ? 0.2 : 1;
  const opacity = animating ? 0.2 : 1;
  const rotate = animating ? 360 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${currentX}px`,
        top: `${currentY}px`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        transition: animating
          ? 'all 0.65s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
          : 'none',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
      className="w-16 h-16 rounded-full overflow-hidden shadow-2xl ring-4 ring-amber-400 bg-black flex items-center justify-center pointer-events-none"
    >
      <img
        src={resolveFoodImage(coords.imageUrl)}
        alt="Adding to Cart"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};
