import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function MagneticButton({ children, className, onClick, disabled }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.2; // 0.2 is the magnetic strength
    const y = (e.clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center transition-all duration-300 ease-out",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Background glow layer */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500",
          isHovered && !disabled ? "opacity-50" : "opacity-0"
        )}
        style={{
          background: "inherit"
        }}
      />
      {/* Foreground content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </button>
  );
}
