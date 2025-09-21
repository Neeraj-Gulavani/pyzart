import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Code, Sparkles, Play, Github, Piano, Volume2, Settings, Headphones, Download, Share2, Eye, TrendingUp, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: 'workspace' | 'dashboard') => void;
  onAuth: () => void;
  isAuthenticated: boolean;
}

// Simple Waveform Component
function SimpleWaveform({ className = "", height = 60 }: { className?: string; height?: number }) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <svg width="100%" height={height} className="overflow-visible">
        <defs>
          <linearGradient id="simple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${height/2} Q 50 ${height/4} 100 ${height/2} T 200 ${height/2} T 300 ${height/2} T 400 ${height/2}`}
          fill="none"
          stroke="url(#simple-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function LandingPage({ onNavigate, onAuth, isAuthenticated }: LandingPageProps) {
  const [activeInstrument, setActiveInstrument] = useState<string>('piano');

  const features = [
    {
      icon: Code,
      title: "Code to Music",
      description: "Transform your code into beautiful musical compositions using advanced algorithmic analysis and pattern recognition."
    },
    {
      icon: Music,
      title: "Multiple Languages", 
      description: "Support for Python, JavaScript, Java, C++, and more programming languages to create diverse soundscapes."
    },
    {
      icon: Sparkles,
      title: "Live Visualization",
      description: "Watch your code come alive with stunning real-time audio visualizations and interactive waveforms."
    },
    {
      icon: Piano,
      title: "Virtual Instruments",
      description: "Choose from a rich collection of virtual instruments including piano, guitar, drums, and synthesizers."
    },
    {
      icon: Settings,
      title: "Customizable Settings",
      description: "Fine-tune tempo, key signatures, scales, and musical styles to match your creative vision."
    },
    {
      icon: Radio,
      title: "Audio Export",
      description: "Export your musical creations in high-quality formats including WAV, MP3, and MIDI files."
    }
  ];

  const instruments = [
    { id: 'piano', name: 'Piano', icon: Piano, color: 'from-blue-500 to-purple-500' },
    { id: 'guitar', name: 'Guitar', icon: Music, color: 'from-green-500 to-teal-500' },
    { id: 'drums', name: 'Drums', icon: Music, color: 'from-red-500 to-pink-500' },
    { id: 'violin', name: 'Violin', icon: Music, color: 'from-yellow-500 to-orange-500' }
  ];

  const languages = [
    { name: 'Python', color: 'bg-blue-500', snippet: 'def fibonacci(n):\n    return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)' },
    { name: 'JavaScript', color: 'bg-yellow-500', snippet: 'const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);' },
    { name: 'Java', color: 'bg-red-500', snippet: 'public class QuickSort {\n    public static void sort(int[] arr, int low, int high) {...}' },
    { name: 'C++', color: 'bg-purple-500', snippet: 'template<typename T>\nclass BinaryTree {\n    struct Node { T data; Node* left, *right; };' }
  ];

  const steps = [
    {
      number: 1,
      title: "Write or Import Code",
      description: "Paste your existing code or write new code in our built-in editor with syntax highlighting",
      icon: Code
    },
    {
      number: 2,
      title: "Choose Your Instruments",
      description: "Select from our virtual instrument library and customize the musical settings",
      icon: Piano
    },
    {
      number: 3,
      title: "Watch the Magic",
      description: "See your code transform into music with real-time visualization and audio generation",
      icon: Radio
    },
    {
      number: 4,
      title: "Export & Share",
      description: "Download your musical creation or share it with the community",
      icon: Download
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pyzart
            </span>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#features" className="hover:text-primary transition-colors">Featured</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                  Dashboard
                </Button>
                <Button onClick={() => onNavigate('workspace')}>
                  Create Music
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onAuth}>
                  Login
                </Button>
                <Button onClick={onAuth}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
              🎵 Algorithmic Music Generation
            </Badge>
            
            <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Turn Code into Music!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Where coding meets creativity—building musical compositions one line at a time. 
              Transform code into sound and immerse yourself in a unique musical journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => onNavigate('workspace')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Coding
              </Button>
              <Button size="lg" variant="outline">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </motion.div>
          
          {/* Interactive Demo Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="max-w-4xl mx-auto overflow-hidden border-2 border-gradient-to-r from-purple-200 to-pink-200 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl mb-4">Interactive Demo</h3>
                    <p className="text-muted-foreground mb-6">
                      Watch how different programming languages create unique musical patterns and rhythms.
                    </p>
                    
                    <div className="space-y-4">
                      {languages.map((lang, index) => (
                        <motion.div
                          key={lang.name}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className={`w-3 h-3 rounded-full ${lang.color}`} />
                          <div className="flex-1">
                            <div className="font-medium">{lang.name}</div>
                            <code className="text-xs text-muted-foreground font-mono">
                              {lang.snippet.substring(0, 40)}...
                            </code>
                          </div>
                          <Volume2 className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1603516875773-9a4c1861d5ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvZGUlMjB2aXN1YWxpemF0aW9ufGVufDF8fHx8MTc1ODQ2ODIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Music Visualization"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Live Waveform</span>
                        <Headphones className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <SimpleWaveform height={60} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to create amazing music from code
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/20 border-2 hover:border-purple-200 dark:hover:border-purple-700">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-6">About Pyzart</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Master programming concepts through hands-on, audio-driven creation. Begin coding your own musical piece from scratch, choosing instruments and moods as your code comes alive in sound.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl mb-4">Where Code Meets Music</h3>
                <p className="text-muted-foreground mb-4">
                  Pyzart transforms the abstract world of programming into tangible musical experiences. 
                  Every variable, function, and loop in your code contributes to a unique musical composition.
                </p>
                <p className="text-muted-foreground">
                  Our platform analyzes code structure, syntax patterns, and algorithmic complexity to generate 
                  corresponding musical elements, making programming concepts audible and intuitive.
                </p>
              </div>
              <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-purple-500" />
                    <span>Code Structure → Musical Rhythm</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-pink-500" />
                    <span>Variables → Musical Notes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span>Functions → Melodic Phrases</span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in just a few simple steps and watch your code come alive
            </p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative z-10 p-6 text-center h-full bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-700">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-sm">
                      {step.number}
                    </div>
                    
                    <h3 className="font-medium mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-6">Ready to Create?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start creating amazing music from your code with our advanced algorithmic platform.
            </p>
            <Button 
              size="lg"
              onClick={() => onNavigate('workspace')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Musical Journey
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pyzart
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Pyzart. Turning code into music, one line at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}