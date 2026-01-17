
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

  // Uses Gemini API to generate decoy words for the impostor to help them blend in
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
        }
      });
      const data = JSON.parse(response.text || "{}");
      if (data.decoys) {
        setDecoyTips(data.decoys);
      }
    } catch (error) {
      console.error("Error fetching decoys:", error);
    } finally {
      setIsLoadingTips(false);
    }
  };

  const handleNext = () => {
    playSound.tap();
    setIsRevealing(false);
    setDecoyTips([]);
    if (currentPlayerIndex < config.players.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPlayerIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onFinish();
    }
  };

  const isLastPlayer = currentPlayerIndex === config.players.length - 1;

  return (
    <div className={`flex-1 flex flex-col items-center justify-center space-y-8 ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
      <div className="text-center space-y-2">
        <h3 className="text-indigo-400 font-bold tracking-widest uppercase">
          {t.playerOf.replace('{n}', (currentPlayerIndex + 1).toString()).replace('{total}', config.players.length.toString())}
        </h3>
        <h2 className="text-4xl font-black">{currentPlayer.name}</h2>
      </div>

      {!isRevealing ? (
        <div className="w-full space-y-8 animate-in zoom-in duration-300">
          <button
            onClick={handleReveal}
            className="w-full aspect-square max-h-[300px] bg-slate-800 rounded-3xl border-4 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 hover:border-indigo-500 transition-colors group"
          >
            <span className="text-7xl group-hover:scale-110 transition-transform">👁️</span>
            <span className="text-xl font-bold text-slate-400">{t.tapToReveal}</span>
          </button>
          <p className="text-center text-slate-500 font-medium">
            {t.noPeeking}
          </p>
        </div>
      ) : (
        <div className="w-full space-y-8 animate-in flip-in-y duration-500">
          <div className={`p-10 rounded-[2.5rem] text-center border-4 ${
            currentPlayer.isImpostor 
              ? 'bg-red-600/20 border-red-500 shadow-2xl shadow-red-900/40' 
              : 'bg-indigo-600/20 border-indigo-500 shadow-2xl shadow-indigo-900/40'
          }`}>
            {currentPlayer.isImpostor ? (
              <>
                <div className="text-6xl mb-4">😈</div>
                <h4 className="text-red-400 font-bold uppercase tracking-widest">{t.youAreImpostor}</h4>
                <div className="text-6xl font-black text-white mb-4">{t.impostor}</div>
                <p className="text-red-300 font-medium">{t.blendIn.replace('{cat}', config.category)}</p>
                
                <div className="mt-8 pt-8 border-t border-red-500/30">
                  {decoyTips.length > 0 ? (
                    <div className="text-left animate-in fade-in slide-in-from-top duration-300">
                      <p className="text-xs font-bold text-red-400 uppercase mb-2">{t.decoyTip}</p>
                      <div className="flex flex-wrap gap-2">
                        {decoyTips.map((tip, i) => (
                          <span key={i} className="bg-red-500/30 px-3 py-1 rounded-full text-sm font-bold border border-red-500/50">
                            {tip}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={fetchDecoyTips}
                      disabled={isLoadingTips}
                      className="text-sm font-bold bg-red-600 text-white px-6 py-3 rounded-xl active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isLoadingTips ? t.thinkingDecoys : t.getDecoyWords}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💎</div>
                <h4 className="text-indigo-400 font-bold uppercase tracking-widest">{t.secretWordLabel}</h4>
                <div className="text-6xl font-black text-white mb-4">{config.secretWord}</div>
                <p className="text-indigo-300 font-medium">{t.categoryLabel.replace('{cat}', config.category)}</p>
              </>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-slate-100 text-slate-900 py-6 rounded-2xl text-2xl font-black active:scale-95 transition-all shadow-xl"
          >
            {isLastPlayer ? t.confirmReveal : t.hideContinue}
          </button>
        </div>
      )}
    </div>
  );
};

export default RevealPhase;
