
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { Language } from '../types';

interface Props {
  playerCount: number;
  onStart: (category: string, impostors: number) => void;
  onBack: () => void;
  t: any;
  lang: Language;
}

const GameSettings: React.FC<Props> = ({ playerCount, onStart, onBack, t, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [impostorCount, setImpostorCount] = useState(1);

  const maxImpostors = Math.max(1, Math.floor(playerCount / 3));

  return (
    <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors p-2 -ml-2">
          ← {t.back}
        </button>
        <h2 className="text-2xl font-bold">{t.gameSettings}</h2>
        <div className="w-10"></div>
      </div>

      <div className="space-y-4">
        <label className="text-slate-400 font-bold text-sm uppercase tracking-wider">{t.selectCategory}</label>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600/20 border-indigo-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-bold">{cat.translations[lang].name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-slate-400 font-bold text-sm uppercase tracking-wider">{t.impostorCount}</label>
          <span className="bg-indigo-600/30 text-indigo-400 px-3 py-1 rounded-full text-sm font-bold">
            {impostorCount} 😈
          </span>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              disabled={n > maxImpostors}
              onClick={() => setImpostorCount(n)}
              className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${
                n > maxImpostors 
                  ? 'opacity-20 bg-slate-900 border-slate-800'
                  : impostorCount === n
                    ? 'bg-indigo-600/20 border-indigo-500'
                    : 'bg-slate-800 border-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {maxImpostors === 1 && (
          <p className="text-xs text-slate-500 text-center">{t.morePlayersNeeded}</p>
        )}
      </div>

      <div className="flex-1"></div>

      <div className="pb-4 safe-bottom">
        <button
          onClick={() => onStart(selectedCategory, impostorCount)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-2xl text-2xl font-bold transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
        >
          {t.confirmReveal}
        </button>
      </div>
    </div>
  );
};

export default GameSettings;
