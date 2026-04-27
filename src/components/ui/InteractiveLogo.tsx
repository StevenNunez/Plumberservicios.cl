'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveLogoProps {
  text?: string;
  className?: string;
  variant?: 'header' | 'footer-small' | 'footer-giant';
}

export default function InteractiveLogo({
  text = 'Teo Labs',
  className,
  variant = 'header',
}: InteractiveLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0.5);
  const containerRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMouseX((e.clientX - rect.left) / rect.width);
    }
  }, []);

  const chars = text.split('');
  const totalChars = chars.filter((c) => c !== ' ').length;

  return (
    <span
      ref={containerRef}
      className={cn('flex select-none', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMouseX(0.5); }}
      onMouseMove={handleMouseMove}
    >
      {chars.map((char, index) => (
        <AnimatedLetter
          key={index}
          char={char}
          index={index}
          variant={variant}
          isHovered={isHovered}
          mouseX={mouseX}
          totalChars={totalChars}
        />
      ))}
    </span>
  );
}

function AnimatedLetter({
  char,
  index,
  variant,
  isHovered,
  mouseX,
  totalChars,
}: {
  char: string;
  index: number;
  variant: 'header' | 'footer-small' | 'footer-giant';
  isHovered: boolean;
  mouseX: number;
  totalChars: number;
}) {
  if (char === ' ') {
    return (
      <span className={cn('inline-block', variant === 'footer-giant' ? 'w-[0.3em]' : 'w-[0.2em]')} />
    );
  }

  const getStyle = (): React.CSSProperties => {
    const intensity = variant === 'footer-giant' ? 8 : 4;
    const skew = variant === 'footer-giant' ? 15 : 10;
    const centered = mouseX - 0.5; // -0.5 a 0.5
    const wave = Math.sin(index * 0.5 + centered * 3) * intensity;

    const transform = isHovered
      ? `translateY(${wave}px) skewX(${centered * skew}deg)`
      : 'translateY(0) skewX(0)';

    const style: React.CSSProperties = {
      transform,
      transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.35s ease-out',
      fontWeight: isHovered || variant === 'footer-giant' ? '700' : '600',
    };

    if (variant === 'footer-giant') {
      style.textShadow = isHovered
        ? `${-4 - centered * 10}px 0 0 rgba(255,0,0,0.6), ${4 - centered * 10}px 0 0 rgba(0,255,255,0.6)`
        : '-3px 0 0 rgba(255,0,0,0.5), 3px 0 0 rgba(0,255,255,0.5)';
    }

    return style;
  };

  void totalChars;

  return (
    <span
      className={cn(
        'inline-block relative cursor-default',
        variant !== 'footer-giant' &&
          'bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent'
      )}
      style={getStyle()}
    >
      {char}
    </span>
  );
}
