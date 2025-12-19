import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Plus, Mic2 } from 'lucide-react';
import { TimerDisplay } from './components/TimerDisplay';
import { TopicCard } from './components/TopicCard';
import { TimerStatus } from './types';

// Sound effect generator using Web Audio API
const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback((type: 'tick' | 'end') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'tick') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    } else {
      // Alarm sound
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 1);
    }
  }, []);

  return { playBeep };
};

const App: React.FC = () => {
  // State
  const [totalSeconds, setTotalSeconds] = useState(180); // Default 3 mins
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { playBeep } = useAudio();

  // Presets
  const presets = [
    { label: '3 分钟', minutes: 3 },
    { label: '5 分钟', minutes: 5 },
    { label: '10 分钟', minutes: 10 },
  ];

  // Timer Logic
  useEffect(() => {
    if (status === 'running' && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer Finished
            setStatus('finished');
            if (!isMuted) playBeep('end');
            return 0;
          }
          // Tick sound for last 5 seconds
          if (prev <= 6 && !isMuted) {
             playBeep('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, isMuted, playBeep, remainingSeconds]);

  // Handlers
  const handleStartPause = () => {
    if (status === 'finished') {
      // If finished, reset logic roughly applies, but usually we want to restart or stay
      return; 
    }
    setStatus(status === 'running' ? 'paused' : 'running');
  };

  const handleReset = () => {
    setStatus('idle');
    setRemainingSeconds(totalSeconds);
  };

  const handlePresetSelect = (minutes: number) => {
    const seconds = minutes * 60;
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setStatus('idle');
    setShowCustomInput(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseFloat(customMinutes);
    if (!isNaN(mins) && mins > 0) {
      const seconds = Math.floor(mins * 60);
      setTotalSeconds(seconds);
      setRemainingSeconds(seconds);
      setStatus('idle');
      setShowCustomInput(false);
      setCustomMinutes('');
    }
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-blue-200">
      
      {/* Background Shapes mimicking the poster */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         {/* Top Right Grid/Dots */}
         <div className="absolute top-0 right-0 w-32 h-32 opacity-20 bg-[radial-gradient(circle,_#3b82f6_2px,_transparent_2px)] bg-[length:10px_10px]"></div>
         {/* Bottom Left Circle */}
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/3"></div>
         {/* Top Left Triangle-ish */}
         <div className="absolute top-10 left-10 w-0 h-0 border-l-[50px] border-l-transparent border-t-[75px] border-t-gray-800 -rotate-12 opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        
        {/* Header Section */}
        <header className="text-center mb-8 relative">
           {/* 'DEBATE COMPETITION' small tag */}
           <div className="inline-block mb-2">
             <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Debate Competition</span>
           </div>
           
           {/* Main Title */}
           <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-2">
             <span className="relative inline-block">
                <span className="absolute -left-6 top-0 text-blue-500 transform -rotate-12">
                   <Mic2 size={32} className="opacity-80" />
                </span>
                首届青年
             </span>
             <span className="relative inline-block ml-2 md:ml-4 z-10">
                辩论赛
                {/* Underline decoration */}
                <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-200 -z-10 rounded-sm transform -skew-x-12"></span>
             </span>
           </h1>
           
           {/* English Subtitle */}
           <div className="bg-black text-white px-4 py-1 text-xs md:text-sm font-bold tracking-widest inline-block transform -skew-x-12 mt-2">
             CAMPUS DEBATE COMPETITION
           </div>
        </header>

        {/* Timer Component */}
        <TimerDisplay 
          remainingSeconds={remainingSeconds} 
          totalSeconds={totalSeconds} 
          status={status} 
        />

        {/* Controls Section */}
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white p-6 md:p-8">
          
          {/* Main Control Buttons */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={handleStartPause}
              disabled={status === 'finished'}
              className={`
                group relative flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all transform active:scale-95
                ${status === 'running' 
                  ? 'bg-amber-400 hover:bg-amber-500 text-amber-950' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'}
                ${status === 'finished' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {status === 'running' ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-gray-200 text-gray-600 shadow-md hover:border-gray-400 hover:text-gray-900 transition-all active:scale-95"
            >
              <RotateCcw size={28} />
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center justify-center w-20 h-20 rounded-full border-2 transition-all active:scale-95
                ${isMuted 
                  ? 'bg-red-50 border-red-100 text-red-400 hover:bg-red-100' 
                  : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500'}
              `}
            >
              {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
            </button>
          </div>

          {/* Separator */}
          <div className="h-px w-full bg-gray-100 mb-6"></div>

          {/* Presets Grid */}
          <div className="grid grid-cols-4 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.minutes}
                onClick={() => handlePresetSelect(preset.minutes)}
                className={`
                  py-2 px-1 rounded-lg text-sm font-bold transition-colors
                  ${totalSeconds === preset.minutes * 60 && !showCustomInput
                    ? 'bg-black text-white shadow-lg transform -translate-y-1' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {preset.label}
              </button>
            ))}

            {/* Custom Time Button */}
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`
                py-2 px-1 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1
                ${showCustomInput 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
              `}
            >
              <Settings size={14} />
              自定义
            </button>
          </div>

          {/* Custom Input Form (Expandable) */}
          {showCustomInput && (
            <form onSubmit={handleCustomSubmit} className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="number"
                step="0.1"
                placeholder="输入分钟数 (例如 2.5)"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50/50"
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={18} className="mr-1" />
                设定
              </button>
            </form>
          )}
        </div>

        {/* Topic Card */}
        <TopicCard />

      </div>
    </div>
  );
};

export default App;