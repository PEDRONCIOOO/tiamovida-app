'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
}

//  * Componente de player de áudio
export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    // Eventos do elemento de áudio
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    
    // Atualiza o tempo atual quando o áudio é reproduzido
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);
  
  // Atualiza o valor do slider quando o tempo atual muda
  const playPauseHandler = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  // Atualiza o valor do slider quando o tempo atual muda
  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };
  // Atualiza o valor do slider quando o tempo atual muda
  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
  };
  // Atualiza o valor do slider quando o tempo atual muda
  const onProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = parseFloat(e.target.value);
  };
  // Formata o tempo para o formato "mm:ss"
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  // Formata o tempo para o formato "mm:ss"
  return (
    <div className="bg-slate-700 p-3 rounded-lg">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <span className="text-sm">{formatTime(duration)}</span>
      </div>
      
      <input
        ref={progressBarRef}
        type="range"
        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
        value={currentTime}
        min="0"
        max={duration}
        onChange={onProgressChange}
      />
      
      <div className="flex justify-center gap-4 mt-4">
        <button 
          onClick={skipBackward}
          className="p-2 rounded-full bg-slate-600 hover:bg-slate-500 transition"
        >
          <SkipBack size={20} />
        </button>
        
        <button 
          onClick={playPauseHandler}
          className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 transition"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button 
          onClick={skipForward}
          className="p-2 rounded-full bg-slate-600 hover:bg-slate-500 transition"
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}