import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface MusicVisualizerProps {
  isPlaying: boolean;
}

export function MusicVisualizer({ isPlaying }: MusicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mock audio data for visualization
    const generateMockData = () => {
      const dataArray = new Uint8Array(64);
      for (let i = 0; i < dataArray.length; i++) {
        if (isPlaying) {
          dataArray[i] = Math.random() * 255 * (0.5 + 0.5 * Math.sin(Date.now() * 0.01 + i * 0.1));
        } else {
          dataArray[i] = Math.max(0, dataArray[i] * 0.95); // Fade out
        }
      }
      return dataArray;
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      const dataArray = generateMockData();
      const barWidth = width / dataArray.length;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.8;
        const x = i * barWidth;
        const y = height - barHeight;

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, `hsl(${(i * 5 + Date.now() * 0.1) % 360}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${(i * 5 + Date.now() * 0.1) % 360}, 50%, 40%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);

        // Add glow effect
        if (isPlaying && barHeight > height * 0.3) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = `hsl(${(i * 5 + Date.now() * 0.1) % 360}, 70%, 60%)`;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
          ctx.shadowBlur = 0;
        }
      }

      // Add waveform overlay
      if (isPlaying) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < width; i++) {
          const amplitude = Math.sin(i * 0.02 + Date.now() * 0.005) * 20 + 
                           Math.sin(i * 0.01 + Date.now() * 0.003) * 10;
          const y = height / 2 + amplitude;
          
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <motion.div 
      className="w-full h-full relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <motion.div
                className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="text-sm">Click play to see visualization</p>
          </motion.div>
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute top-2 left-2 text-xs text-white/70 bg-black/30 px-2 py-1 rounded">
        {isPlaying ? 'Live' : 'Paused'}
      </div>
    </motion.div>
  );
}