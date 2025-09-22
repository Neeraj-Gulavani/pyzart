import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, Square, Volume2, Download, 
  Plus, X, Code, Music, Settings, Share, Save,
  FileText, Home, BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { CodeEditor } from './code-editor';
import { MusicVisualizer } from './music-visualizer';

interface WorkspaceProps {
  onNavigate: (page: 'landing' | 'dashboard') => void;
}

export function Workspace({ onNavigate }: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState('main.py');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [tabs, setTabs] = useState([
    { id: 'main.py', name: 'main.py', content: '# Welcome to Pyzart!\n# Write your code here and watch it transform into music\n\npiano = Piano()\nguitar = Guitar()\n\n# Test single notes\n#piano.play_note("C4", duration=1.0)\n#guitar.play_note("E3", duration=2.0)\n\n# Test chords\n#piano.play_chord("Cmaj7", duration=1.0, octave=4)\n#guitar.play_chord("Am", duration=1.5, octave=3)\n\nfor i in range(3):\n    piano.play_note("C5",duration=0.4)\npiano.play_note("A#4",duration=0.4)\npiano.play_note("G4",duration=0.4)\npiano.play_note("G4",duration=0.8)\nfor i in range(2):\n    piano.play_note("F4",duration=0.4)\npiano.play_note("D#4",duration=0.4)\npiano.play_note("F",duration=0.4)\npiano.play_note("G4",duration=4)\nfor i in range(1,30):\n    piano.play_note("C4", duration=i/100)\nfor i in range(30,1,-1):\n    piano.play_note("C4",duration=i/100)' },
    { id: 'harmony.js', name: 'harmony.js', content: '// JavaScript harmony generator\nconst notes = ["C", "D", "E", "F", "G", "A", "B"];\n\nfunction generateHarmony(scale) {\n  return scale.map(note => {\n    return notes.includes(note) ? note : "Rest";\n  });\n}\n\nconsole.log(generateHarmony(["C", "E", "G"]));' }
  ]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && audioRef.current) {
        setCurrentTime(audioRef.current.currentTime || 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

 const togglePlayback = () => {
  if (!audioRef.current) return;

  if (isPlaying) {
    audioRef.current.pause();
    setIsPlaying(false);
  } else {
    audioRef.current.play();
    setIsPlaying(true);
  }
};


  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const addNewTab = () => {
    const newTabId = `file${tabs.length + 1}.py`;
    setTabs([...tabs, {
      id: newTabId,
      name: newTabId,
      content: '# New file\nprint("Hello, World!")'
    }]);
    setActiveTab(newTabId);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMusicGenerated = () => {
  const newUrl = `http://127.0.0.1:5000/stream-mp3?ts=${Date.now()}`;
  setAudioUrl(newUrl);

  if (audioRef.current) {
    audioRef.current.src = newUrl;   // update source
    audioRef.current.load();         // reload
    audioRef.current.play();         // auto-play new audio
    setIsPlaying(true);
  }
};


  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <motion.header 
        className="border-b border-border p-4 flex items-center justify-between"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('landing')}>
            <Home className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Untitled Project</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </motion.header>
      <audio
  ref={audioRef}
  style={{ display: "none" }}
  controls={false}
/>


      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor Section */}
        <motion.div 
          className="flex-1 flex flex-col"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* File Tabs */}
          <div className="border-b border-border px-4">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg cursor-pointer transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-background border-b-2 border-primary' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{tab.name}</span>
                  {tabs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={addNewTab}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4">
            <CodeEditor 
              value={tabs.find(tab => tab.id === activeTab)?.content || ''}
              onChange={(value) => {
                setTabs(tabs.map(tab => 
                  tab.id === activeTab ? { ...tab, content: value } : tab
                ));
              }}
              language={activeTab.endsWith('.py') ? 'python' : 'javascript'}
              onMusicGenerated={handleMusicGenerated}
            />
          </div>
        </motion.div>

        {/* Music Visualization & Controls */}
        <motion.div 
          className="w-96 border-l border-border flex flex-col"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Music Controls */}
          <Card className="m-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Music Player
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-2">
                <Button variant="outline" size="icon" onClick={stopPlayback}>
                  <Square className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={togglePlayback}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="w-full"
                  onValueChange={([value]) => setCurrentTime(value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={setVolume}
                />
                <span className="text-xs text-muted-foreground w-8">
                  {volume[0]}%
                </span>
              </div>

              {/* Current Track Info */}
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                <p className="font-medium">Generated Track</p>
                <p className="text-sm text-muted-foreground">From: {activeTab}</p>
                <Badge variant="secondary" className="mt-2">
                  <Code className="h-3 w-3 mr-1" />
                  Python Algorithm
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Music Visualizer */}
          <Card className="m-4 flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Visualization</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <MusicVisualizer isPlaying={isPlaying} />
            </CardContent>
          </Card>

          {/* Hidden audio element for demo */}
      {/*    <audio 
  ref={audioRef} 
  loop 
  src={audioUrl || "http://127.0.0.1:5000/stream-mp3"} 
  style={{ display: "none" }}
/>
*/}
        </motion.div>

        {/* Settings & Export Panel */}
        <motion.div 
          className="w-80 border-l border-border flex flex-col"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Music Settings */}
          <Card className="m-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Music Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tempo Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tempo (BPM)</label>
                <Slider
                  defaultValue={[120]}
                  max={200}
                  min={60}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>60</span>
                  <span>120</span>
                  <span>200</span>
                </div>
              </div>

              {/* Scale Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Musical Scale</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Major', 'Minor', 'Pentatonic', 'Blues'].map((scale) => (
                    <Button key={scale} variant="outline" size="sm" className="text-xs">
                      {scale}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Instrument Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Instrument</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Piano', 'Synth', 'Guitar', 'Drums'].map((instrument) => (
                    <Button key={instrument} variant="outline" size="sm" className="text-xs">
                      {instrument}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="m-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download WAV
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download MP3
              </Button>
              <Button className="w-full" variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Export MIDI
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Share className="h-4 w-4 mr-2" />
                Share Project
              </Button>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card className="m-4 flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Duration: {formatTime(duration)}</p>
                <p className="text-muted-foreground">Created: Today</p>
                <p className="text-muted-foreground">Language: Python</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input 
                  type="text" 
                  placeholder="Untitled Project"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Add a description..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}