import React, { useState } from 'react';
import CodeEditor from './components/code-editor';
import MusicPlayer from './components/music-player'; // Adjust path if needed

export default function Workspace() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          onAudioReady={setAudioUrl}
        />
      </div>

      {/* Render the music player when audio URL is available */}
      {audioUrl && (
        <MusicPlayer audioUrl={audioUrl} />
      )}
    </div>
  );
}