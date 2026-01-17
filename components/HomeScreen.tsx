
import React from 'react';
import { playSound } from '../utils/sounds';

interface Props {
  onStart: () => void;
  t: any;
}

const HomeScreen: React.FC<Props> = ({ onStart, t }) => {
  const handleStart = () => {
    playSound.tap();
    onStart();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <div className="text-8xl mb-4">😈</div>
        <h1 className="text-6xl font-extrabold tracking-tighter bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent">
          {t.appName}
        </h1>
        <p className="text-slate-400 text-lg font-medium px-4">
          {t.tagline}
        </p>
      </div>

      <div className="w-full space-y-4 px-4">
        <button
          onClick={handleStart}
          className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all py-6 rounded-2xl text-2xl font-bold shadow-xl shadow-indigo-900/40"
        >
          {t.startGame}
        </button>
        
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
            <span>📖</span> {t.howToPlay}
          </h2>
          <ul className="text-sm text-slate-300 space-y-2">
            {t.rules.map((rule: string, i: number) => (
              <li key={i} className="flex gap-2">
                <span className="text-indigo-500 font-bold">{i + 1}.</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-xs text-slate-500 font-medium opacity-50">
        {t.bestPlayed}
      </div>
    </div>
  );
};

export default HomeScreen;
