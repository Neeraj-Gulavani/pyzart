import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music } from 'lucide-react';

interface MusicNoteAnimationProps {
  className?: string;
}

interface Note {
  id: number;
  icon: React.ComponentType<any>;
  x: number;
  y: number;
  delay: number;
}

export function MusicNoteAnimation({ className = "" }: MusicNoteAnimationProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const musicIcons = [Music];

  useEffect(() => {
    const generateNotes = () => {
      const newNotes: Note[] = Array.from({ length: 4 }, (_, i) => ({
        id: Date.now() + i, // Use timestamp for unique keys
        icon: musicIcons[0], // Use first icon only
        x: 10 + (i * 20) + Math.random() * 10, // Spread notes more evenly
        y: 20 + Math.random() * 60, // Keep within bounds
        delay: i * 0.5
      }));
      setNotes(newNotes);
    };

    generateNotes();
    const interval = setInterval(generateNotes, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            key={note.id}
            className="absolute text-purple-400/20 dark:text-purple-300/15 pointer-events-none"
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              y: 0
            }}
            animate={{ 
              opacity: [0, 0.5, 0.3, 0],
              scale: [0, 1, 1, 0],
              y: [0, -30, -60, -80]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 3,
              delay: note.delay,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Music className="w-4 h-4" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}