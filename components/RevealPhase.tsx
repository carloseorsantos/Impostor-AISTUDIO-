
import React, { useState } from 'react';
import { GameConfig } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { playSound } from '../utils/sounds';

interface Props {
  config: GameConfig;
  onFinish: () => void;
  t: any;
}

const RevealPhase: React.FC<Props> = ({ config, onFinish, t }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [decoyTips, setDecoyTips] = useState<string[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState(false);

  const currentPlayer = config.players[currentPlayerIndex];

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const handleReveal = () => {
    triggerHaptic();
    if (currentPlayer.isImpostor) {
      playSound.revealImpostor();
    } else {
      playSound.revealSecret();
    }
    setIsRevealing(true);
  };

  const fetchDecoyTips = async () => {
    triggerHaptic();
    playSound.tap();
    setIsLoadingTips(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The game is 'Impostor'. The category is '${config.category}'. The secret word is '${config.secretWord}'. Generate 3 different decoy words that belong to this category but are NOT the secret word. Use the language of the category provided. Generate response in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              decoys: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Three decoy words from the category."
              }
            },
            required: ["decoys"]
          }
        },
      });
      
      const data = JSON.parse(response.text || '{"decoys":[]}');
      setDecoyTips(data.decoys || []);
    } catch (error) {
      console.error("Failed to fetch decoy tips:", error);
      setDecoyTips(["Stay Vague", "Copy Others", "Observe First"]);
    } finally {
      setIsLoadingTips(false);
    }
  };

  const handleNext = () => {
    triggerHaptic();
    playSound.tap();
    if (currentPlayerIndex < config.players.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPlayerIndex(prev => prev + 1);
        setIsRevealing(false);
        setIsTransitioning(false);
        setDecoyTips([]);
      }, 300);
    } else {
      onFinish();
    }
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center mb-8">
        <h2 className="text-sm text-indigo-400 font-bold uppercase tracking-widest mb-1">
          {t.playerOf.replace('{n}', (currentPlayerIndex + 1).toString()).replace('{total}', config.players.length.toString())}
        </h2>
        <div className="text-4xl font-extrabold text-white">
          {currentPlayer.name}
        </div>
      </div>

      {!isRevealing ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-8">
          <div 
            onClick={handleReveal}
            className="w-full aspect-[3/4] max-h-[400px] bg-indigo-600 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all group border-4 border-indigo-400/30"
          >
            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">👀</div>
            <p className="text-2xl font-bold">{t.tapToReveal}</p>
            <p className="text-indigo-200 mt-2 text-sm">{t.noPeeking}</p>
          </div>
          <p className="text-slate-500 text-center max-w-[250px]">
            {t.handTo.replace('{name}', currentPlayer.name)}
          </p>
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6 animate-in flip-in-y duration-500 overflow-y-auto custom-scrollbar">
          <div 
            className={`w-full shrink-0 aspect-[3/4] max-h-[360px] rounded-[2rem] shadow-2xl flex flex-col items-center justify-center border-4 ${
              currentPlayer.isImpostor 
                ? 'bg-red-900/40 border-red-500 shadow-red-900/20' 
                : 'bg-emerald-900/40 border-emerald-500 shadow-emerald-900/20'
            }`}
          >
            {currentPlayer.isImpostor ? (
              <>
                <div className="text-6xl mb-4">😈</div>
                <h3 className="text-2xl font-black text-red-500 uppercase tracking-tighter">
                  {t.youAreImpostor}
                </h3>
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter">
                  {t.impostor}
                </h3>
                <p className="mt-4 text-red-100 font-medium px-8 text-center text-sm leading-relaxed">
                  {t.blendIn.replace('{cat}', config.category)}
                </p>
              </>
            ) : (
              <>
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">
                  {t.secretWordLabel}
                </div>
                <div className="text-5xl font-black text-white text-center px-4 leading-tight">
                  {config.secretWord}
                </div>
                <p className="mt-6 text-emerald-200 font-medium bg-emerald-900/60 px-4 py-1 rounded-full text-sm">
                  {t.categoryLabel.replace('{cat}', config.category)}
                </p>
              </>
            )}
          </div>

          {currentPlayer.isImpostor && (
            <div className="w-full space-y-3 px-2">
              {decoyTips.length === 0 ? (
                <button
                  onClick={fetchDecoyTips}
                  disabled={isLoadingTips}
                  className="w-full bg-red-600/20 border-2 border-red-500/50 hover:bg-red-600/30 text-red-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoadingTips ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {t.thinkingDecoys}
                    </span>
                  ) : (
                    <>✨ {t.getDecoyWords}</>
                  )}
                </button>
              ) : (
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-red-500/30 animate-in fade-in slide-in-from-bottom duration-300">
                  <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-3 text-center">{t.decoyTip}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {decoyTips.map((tip, i) => (
                      <div key={i} className="bg-slate-900/80 border border-slate-700 py-2 px-1 rounded-lg text-center text-xs font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full bg-slate-100 text-slate-900 py-5 rounded-2xl text-xl font-black shadow-xl active:scale-95 transition-all mt-auto"
          >
            {t.hideContinue}
          </button>
        </div>
      )}

      <style>{`
        .flip-in-y {
          animation: flip-in-y 0.5s ease-out;
        }
        @keyframes flip-in-y {
          from { transform: rotateY(90deg); opacity: 0; }
          to { transform: rotateY(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RevealPhase;
