import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { 
  Play, Pause, Square, Volume2, Download, 
  Plus, X, Code, Music, Settings, Share, Save,
  FileText, Home, BarChart3, MessageCircle, Send
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
//chat importsss
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
//end chat imports
interface WorkspaceProps {
  onNavigate: (page: 'landing' | 'dashboard') => void;
}

export function Workspace({ onNavigate }: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState('main.py');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const TITLE: string = "# demo_song.py\n# Demo song for Pyzart\n# --------------------\n# This is a sequential piano demo.\n# It uses loops and simple chord progressions.\n# Each note or chord is played one after another (no polyphony).\n# Loops are used to repeat patterns efficiently.\n# Chords are written as \"C\", \"F\", \"G\" instead of \"Cmaj\", etc.\n\npiano = Piano()\n\n# --- Intro: simple arpeggio ---\nfor i in range(3):\n    piano.play_note(\"C\", duration=0.5)\n    piano.play_note(\"E\", duration=0.5)\n    piano.play_note(\"G\", duration=0.5)\n    piano.play_note(\"C\", duration=1.0)\n\n# --- Main chord progression ---\nchords = [\"C\", \"F\", \"G\", \"C\"]\nfor chord in chords:\n    piano.play_chord(chord, duration=1.0)\n\n# --- Repeated motif ---\nfor i in range(2):\n    piano.play_note(\"E\", duration=0.5)\n    piano.play_note(\"F\", duration=0.5)\n    piano.play_note(\"G\", duration=1.0)\n\n# --- Crescendo/Decrescendo effect ---\n# Gradually speed up then slow down the note \"C\"\nfor i in range(1, 30):\n    piano.play_note(\"C\", duration=i/100)\nfor i in range(30, 1, -1):\n    piano.play_note(\"C\", duration=i/100)\n\n# --- Closing chord ---\npiano.play_chord(\"C\", duration=2.0)\n\n# Notes on working:\n# 1. Each piano object calls SCAMP's play_note/play_chord under the hood.\n# 2. Sequential calls mean notes/chords play one after another, no overlaps.\n# 3. Loops reduce repetition and make patterns compact.\n# 4. Duration controls how long each note/chord plays.\n# 5. Changing duration in a loop can create interesting dynamics like crescendos. ";
  const [tabs, setTabs] = useState([
    { id: 'main.py', name: 'main.py', content: TITLE },
  ]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string>('Welcome to Pyzart!\n');
  const [terminalColor, setTerminalColor] = useState<string>('text-green-400');

  const audioRef = useRef<HTMLAudioElement>(null);

  // Chat state
const [isChatOpen, setIsChatOpen] = useState(false);
const [chatMessages, setChatMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([
  { from: 'bot', text: 'Hello! How can I help you with music code?' },
]);
const [chatInput, setChatInput] = useState('');

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
    setTabs([
      ...tabs,
      {
        id: newTabId,
        name: newTabId,
        content: '# New file\nprint("Hello, World!")',
      },
    ]);
    setActiveTab(newTabId);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((tab) => tab.id !== tabId);
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  const sendMessage = async () => {
  if (!chatInput.trim()) return;

  // Add user message locally
  setChatMessages([...chatMessages, { from: 'user', text: chatInput }]);
  const message = chatInput;
  setChatInput('');

  try {
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();

    // Add bot response
    setChatMessages((prev) => [...prev, { from: 'bot', text: data.reply }]);
  } catch (err) {
    console.error(err);
    setChatMessages((prev) => [...prev, { from: 'bot', text: 'Error: cannot reach server' }]);
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
      audioRef.current.src = newUrl; // update source
      audioRef.current.load(); // reload
      audioRef.current.play(); // auto-play new audio
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

      <audio ref={audioRef} style={{ display: 'none' }} controls={false} />

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
              value={tabs.find((tab) => tab.id === activeTab)?.content || ''}
              onChange={(value) => {
                setTabs(
                  tabs.map((tab) =>
                    tab.id === activeTab ? { ...tab, content: value } : tab
                  )
                );
              }}
              language={activeTab.endsWith('.py') ? 'python' : 'javascript'}
              onMusicGenerated={handleMusicGenerated}
              setTerminalOutput={setTerminalOutput}
              setTerminalColor={setTerminalColor}
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
                <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
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

          {/* Terminal Output */}
          <Card className="m-4 flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Terminal</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <div
                className={`h-full w-full bg-black font-mono text-xs rounded p-3 overflow-auto ${terminalColor}`}
                style={{
                  minHeight: '16rem',
                  maxHeight: '16rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {terminalOutput}
              </div>
            </CardContent>
          </Card>
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
                <Slider defaultValue={[120]} max={200} min={60} step={5} className="w-full" />
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
                <Input type="text" placeholder="Untitled Project" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Add a description..." rows={3} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating Chat */}
{!isChatOpen ? (
  <Button
    className="fixed top-20 right-4 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 z-50"
    onClick={() => setIsChatOpen(true)}
  >
    <MessageCircle className="h-6 w-6 text-white" />
  </Button>
) : (
  <motion.div
    className="fixed bottom-4 right-4 w-80 h-96 bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }}
  >
    {/* Chat Header */}
    <div className="flex items-center justify-between p-3 border-b border-border cursor-move">
      <span className="font-semibold text-sm">AI Assistant</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsChatOpen(false)}
        className="h-6 w-6"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>

     {/* Chat Messages */}
  <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
    {chatMessages.map((msg, idx) => (
      <div
        key={idx}
        className={`rounded-lg p-2 w-fit max-w-[85%] ${ // increased max-width slightly for code
          msg.from === 'user'
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-accent text-accent-foreground' // Use accent-foreground for better contrast
        }`}
      >
        {/* MODIFIED THIS PART to use ReactMarkdown */}
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus} // You can choose any theme you like
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-black/10 rounded-sm px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {msg.text}
        </ReactMarkdown>
      </div>
    ))}
  </div>



    {/* Chat Input */}
    <div className="p-3 border-t border-border flex items-center space-x-2">
  <Input
    placeholder="Type a message..."
    className="flex-1"
    value={chatInput}
    onChange={(e) => setChatInput(e.target.value)}
    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
  />
  <Button size="icon" className="bg-gradient-to-r from-purple-600 to-pink-600" onClick={sendMessage}>
    <Send className="h-4 w-4 text-white" />
  </Button>
</div>

  </motion.div>
)}

    </div>
  );
}
