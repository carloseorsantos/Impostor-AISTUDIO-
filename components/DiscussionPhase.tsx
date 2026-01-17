
import React, { useState, useEffect } from 'react';

interface Props {
  onReveal: () => void;
  t: any;
}

const DiscussionPhase: React.FC<Props> = ({ onReveal, t }) => {
  const [seconds, setSeconds] = useState(180); // 3 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    triggerHaptic();
    setIsActive(!isActive);
  };

  const handleReset = () => {
    triggerHaptic();
    setSeconds(180);
    setIsActive(false);
  };

  const handleRevealClick = () => {
    triggerHaptic();
    onReveal();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tight">{t.timeToDiscuss}</h2>
        <p className="text-slate-400 text-lg px-8">
          {t.discussDesc}
        </p>
      </div>

      <div className="w-full bg-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-inner border border-slate-700">
        <div className={`text-7xl font-mono font-bold mb-6 ${seconds < 30 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
          {formatTime(seconds)}
        </div>
        
        <div className="flex gap-4 w-full">
          {!isActive ? (
            <button
              onClick={handleToggleTimer}
              className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold text-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform"
            >
              {t.startTimer}
            </button>
          ) : (
            <button
              onClick={handleToggleTimer}
              className="flex-1 bg-amber-600 py-4 rounded-xl font-bold text-xl shadow-lg shadow-amber-900/20 active:scale-95 transition-transform"
            >
              {t.pause}
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-4 bg-slate-700 rounded-xl hover:bg-slate-600 active:scale-95 transition-all"
          >
            {t.reset}
          </button>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="bg-slate-800/50 p-6 rounded-2xl text-sm border border-slate-700/50">
          <p className="text-indigo-300 font-bold mb-2">💡 {t.tipsTitle}</p>
          <ul className="space-y-1 text-slate-400">
            {t.tips.map((tip: string, i: number) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleRevealClick}
          className="w-full bg-indigo-600 py-6 rounded-2xl text-2xl font-black shadow-xl active:scale-95 transition-all"
        >
          {t.whoWasIt}
        </button>
      </div>
    </div>
  );
};

export default DiscussionPhase;
