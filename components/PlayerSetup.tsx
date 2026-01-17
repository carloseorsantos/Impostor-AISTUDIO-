
import React, { useState } from 'react';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';

interface Props {
  players: string[];
  setPlayers: (players: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  t: any;
}

const PlayerSetup: React.FC<Props> = ({ players, setPlayers, onNext, onBack, t }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < MAX_PLAYERS) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > MIN_PLAYERS) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addPlayer();
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors p-2 -ml-2">
          ← {t.back}
        </button>
        <h2 className="text-2xl font-bold">{t.players} ({players.length})</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.enterName}
          className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
        />
        <button
          onClick={addPlayer}
          disabled={!newPlayerName.trim() || players.length >= MAX_PLAYERS}
          className="bg-indigo-600 disabled:opacity-50 disabled:bg-slate-700 rounded-xl px-6 font-bold"
        >
          {t.add}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {players.map((player, index) => (
          <div
            key={index}
            className="bg-slate-800/80 p-4 rounded-xl flex items-center justify-between border border-slate-700 group animate-in slide-in-from-bottom duration-200"
          >
            <span className="font-medium text-lg">{player}</span>
            <button
              onClick={() => removePlayer(index)}
              className="text-slate-500 hover:text-red-400 transition-colors p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 safe-bottom">
        <button
          onClick={onNext}
          disabled={players.length < MIN_PLAYERS}
          className="w-full bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 py-5 rounded-2xl text-xl font-bold transition-all shadow-lg active:scale-95"
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
