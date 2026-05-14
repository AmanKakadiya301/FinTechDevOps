import React, { useRef, useState } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import { cn } from './MagneticButton';

export function GlowingCard({ children, className, onClick }) {
  const cardRef = useRef(null);
  const mousePosition = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate position relative to the card for the glow effect
  let mouseX = 0;
  let mouseY = 0;
  if (cardRef.current) {
    const rect = cardRef.current.getBoundingClientRect();
    mouseX = mousePosition.x - rect.left;
    mouseY = mousePosition.y - rect.top;
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden glass-card rounded-[2rem]",
        onClick ? "cursor-pointer" : "",
        className
      )}
    >
      {/* Dynamic Cursor Glow Layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(34,211,238,0.04), transparent 40%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
