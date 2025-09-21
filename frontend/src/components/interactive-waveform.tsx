import React, { useState } from 'react';
import { motion } from 'motion/react';

interface InteractiveWaveformProps {
  className?: string;
  height?: number;
  animated?: boolean;
}

export function InteractiveWaveform({ className = "", height = 80, animated = true }: InteractiveWaveformProps) {
  const [isHovered, setIsHovered] = useState(false);
  const gradientId = `waveform-gradient-${Math.random().toString(36).substr(2, 9)}`;

  // Generate SVG waveform points
  const generateWaveform = () => {
    const points = [];
    const width = 400;
    const amplitude = isHovered ? 30 : 20;
    const frequency = 0.02;
    
    for (let x = 0; x < width; x += 4) {
      const y = height / 2 + Math.sin(x * frequency) * amplitude * Math.sin(x * 0.01);
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };

  return (
    <div 
      className={`w-full cursor-pointer ${className}`}
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width="100%" height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <motion.polyline
          points={generateWaveform()}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            x: animated ? [-10, 10, -10] : 0
          }}
          transition={{
            pathLength: { duration: 1 },
            x: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </svg>
    </div>
  );
}