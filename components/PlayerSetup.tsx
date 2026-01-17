
import React, { useState, useRef } from 'react';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';
import { playSound } from '../utils/sounds';

interface Props {
  players: string[];
  setPlayers: (players: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  t: any;
}

const PlayerSetup: React.FC<Props> = ({ players, setPlayers, onNext, onBack, t }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < MAX_PLAYERS) {
      playSound.tap();
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
      inputRef.current?.focus();
    }
  };

  const removePlayer = (index: number) => {
    playSound.tap();
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addPlayer();
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors p-2 -ml-2 font-bold text-sm uppercase tracking-widest">
          ← {t.back}
        </button>
        <div className="flex flex-col items-end">
          <h2 className="text-xl font-black uppercase tracking-tight">{t.players}</h2>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded-full border border-indigo-500/20">
            {players.length} / {MAX_PLAYERS}
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="flex gap-2 mb-6 p-2 bg-slate-800 rounded-2xl border border-slate-700 focus-within:border-indigo-500 transition-all shadow-inner">
        <input
          ref={inputRef}
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.enterName}
          className="flex-1 bg-transparent border-none rounded-xl px-4 py-3 outline-none font-bold placeholder:text-slate-600"
        />
        <button
          onClick={addPlayer}
          disabled={!newPlayerName.trim() || players.length >= MAX_PLAYERS}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale rounded-xl px-5 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg"
        >
          {t.add}
        </button>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-[200px]">
        {players.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-8 py-12 space-y-4">
            <div className="text-6xl">👥</div>
            <p className="font-bold text-sm uppercase tracking-widest leading-tight">
              {t.rules[2].replace('discussion', 'list')} <br/> 
              (No players yet)
            </p>
          </div>
        ) : (
          players.map((player, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between border border-slate-700/50 group animate-in slide-in-from-bottom duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-600">
                  {index + 1}
                </span>
                <span className="font-bold text-lg text-white">{player}</span>
              </div>
              <button
                onClick={() => removePlayer(index)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors bg-slate-900/50 rounded-xl active:scale-90"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Button */}
      <div className="pt-6 pb-2 safe-bottom">
        <button
          onClick={() => {
            playSound.tap();
            onNext();
          }}
          disabled={players.length < MIN_PLAYERS}
          className={`w-full py-6 rounded-[2rem] text-2xl font-black transition-all shadow-xl active:scale-95 border-b-4 ${
            players.length < MIN_PLAYERS 
              ? 'bg-slate-800 text-slate-600 border-slate-900 opacity-50 grayscale' 
              : 'bg-indigo-600 text-white border-indigo-800 shadow-indigo-600/20'
          }`}
        >
          {players.length < MIN_PLAYERS 
            ? t.addMore.replace('{n}', (MIN_PLAYERS - players.length).toString()) 
            : t.next}
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;
