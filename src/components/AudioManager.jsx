import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const AudioManager = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);

  // Setup Audio Context & Analyser
  const initAudio = () => {
    if (audioContextRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const source = context.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = context;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
  };

  const togglePlay = () => {
    initAudio();
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const updateVisuals = () => {
      if (!isPlaying || !analyserRef.current) {
        animationIdRef.current = requestAnimationFrame(updateVisuals);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      const average = sum / dataArrayRef.current.length;
      const intensity = average / 255;

      window.audioIntensity = intensity;

      // Update global CSS variable for performance
      document.documentElement.style.setProperty('--audio-intensity', intensity.toString());

      animationIdRef.current = requestAnimationFrame(updateVisuals);
    };

    updateVisuals();
    return () => cancelAnimationFrame(animationIdRef.current);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-10 left-10 z-[200] flex items-center gap-4">
      <audio ref={audioRef} src="/music.mp3" loop />
      
      <button 
        onClick={togglePlay}
        className="group relative w-16 h-16 rounded-full bg-red-600/20 backdrop-blur-xl border border-red-500/40 flex items-center justify-center hover:bg-red-600/40 transition-all duration-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Play/Pause Icon - Spiderman Themed */}
        <div className="relative z-10 w-8 h-8">
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="white" className="w-full h-full drop-shadow-md">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" className="w-full h-full drop-shadow-md ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        {/* Animated Rings */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 border border-red-500/20 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
          </div>
        )}
      </button>

      {/* Track Info */}
      <div className={`transition-all duration-500 ${isPlaying ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
        <p className="text-red-500 font-mono text-[10px] uppercase tracking-[0.3em] font-black animate-pulse">Now Playing</p>
        <p className="text-white font-sans text-xs font-light tracking-widest opacity-70">Babydoll — Dominic Fike</p>
      </div>
    </div>
  );
};

export default AudioManager;
