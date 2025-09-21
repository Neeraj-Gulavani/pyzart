import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Code, Music, Heart, Download } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedProjectCardProps {
  title: string;
  description: string;
  language: string;
  genre: string;
  image: string;
  codeSnippet: string;
  likes: number;
  downloads: number;
  className?: string;
}

export function FeaturedProjectCard({
  title,
  description,
  language,
  genre,
  image,
  codeSnippet,
  likes,
  downloads,
  className = ""
}: FeaturedProjectCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  return (
    <motion.div
      className={className}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300">
        <div className="relative">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2 bg-purple-500/90 text-white">
                  {language}
                </Badge>
                <h3 className="text-white font-semibold text-lg">{title}</h3>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={togglePlay}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-purple-500" />
            <Badge variant="outline">{genre}</Badge>
          </div>
          
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            {description}
          </p>
          
          <motion.div
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4"
            initial={{ height: 60 }}
            animate={{ height: isHovered ? 120 : 60 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Code Preview</span>
            </div>
            <code className="text-xs text-gray-700 dark:text-gray-300 font-mono overflow-hidden">
              {codeSnippet}
            </code>
          </motion.div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{downloads}</span>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Try This Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}