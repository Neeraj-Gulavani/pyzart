import React from 'react';
import { motion } from 'motion/react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'python' | 'javascript';
  onMusicGenerated?: () => void; // new prop
}

export function CodeEditor({ value, onChange, language, onMusicGenerated }: CodeEditorProps) {
  // Sends code to Flask backend
  async function sendCode() {
    const response = await fetch("http://127.0.0.1:5000/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code: value })
    });
    const data = await response.json();
    console.log(data);
    if (data.code==400) {
      
    }
    if (data.message == "Code received!" && onMusicGenerated) {
      console.log("received..");
      onMusicGenerated();
    }
  }
  const getLanguageClass = () => {
    switch (language) {
      case 'python':
        return 'language-python';
      case 'javascript':
        return 'language-javascript';
      default:
        return 'language-text';
    }
  };

  const lineNumbers = value.split('\n').map((_, index) => index + 1);

  return (
    <motion.div 
      className="h-full border border-border rounded-lg overflow-hidden bg-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-full">
        {/* Line Numbers */}
        <div className="bg-muted/50 border-r border-border p-4 text-sm text-muted-foreground font-mono select-none">
          {lineNumbers.map((num) => (
            <div key={num} className="text-right leading-6 min-w-[2rem]">
              {num}
            </div>
          ))}
        </div>
        
        {/* Code Area */}
        <div className="flex-1 relative">
          <MonacoEditor
            height="calc(100vh - 180px)" // fills most of the screen, adjust as needed
            width="100%"
            language={language}
            value={value}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'Fira Mono, Menlo, Monaco, "Courier New", monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'off', // We show our own line numbers
              padding: { top: 16, bottom: 16 },
              scrollbar: {
                vertical: 'visible',
                horizontal: 'auto',
                useShadows: false,
                verticalScrollbarSize: 12,
                horizontalScrollbarSize: 12,
              },
            }}
            onChange={(val) => onChange(val ?? '')}
          />
          <button
            onClick={sendCode}
            className="absolute bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:bg-primary/90 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
            type="button"
          >
            Run
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-border px-4 py-2 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Lines: {lineNumbers.length}</span>
          <span>Length: {value.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Auto-generating music...</span>
        </div>
      </div>
    </motion.div>
  );
}