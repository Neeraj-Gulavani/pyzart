import React from 'react';
import { motion } from 'motion/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'python' | 'javascript';
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
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
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-6 ${getLanguageClass()}`}
            placeholder="Write your code here..."
            spellCheck={false}
            style={{ 
              lineHeight: '1.5rem',
              tabSize: 2
            }}
          />
          
          {/* Syntax highlighting overlay would go here in a real implementation */}
          <div className="absolute top-4 right-4">
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              {language.toUpperCase()}
            </div>
          </div>
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