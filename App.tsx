
import React, { useState, useCallback, useEffect } from 'react';
import { GameScreen, Player, GameConfig, Language } from './types';
import { CATEGORIES } from './constants';
import { UI_STRINGS } from './i18n';
import { playSound } from './utils/sounds';
import HomeScreen from './components/HomeScreen';
import PlayerSetup from './components/PlayerSetup';
import GameSettings from './components/GameSettings';
import RevealPhase from './components/RevealPhase';
import DiscussionPhase from './components/DiscussionPhase';
import ResultPhase from './components/ResultPhase';

const App: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>(GameScreen.HOME);
  const [players, setPlayers] = useState<string[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  
  // Persistence: Load language from localStorage or default to 'en'
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('impostor_lang');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const t = UI_STRINGS[lang];

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('impostor_lang', lang);
  }, [lang]);

  // Play transition sound on screen change
  useEffect(() => {
    if (screen !== GameScreen.HOME) {
      playSound.transition();
    }
  }, [screen]);

  const startGame = useCallback((selectedCategoryId: string, impostorCount: number) => {
    const categoryObj = CATEGORIES.find(c => c.id === selectedCategoryId) || CATEGORIES[0];
    const langData = categoryObj.translations[lang];
    const secretWord = langData.words[Math.floor(Math.random() * langData.words.length)];
    
    // Create base player objects
    const playerObjects: Player[] = players.map((name, index) => ({
      id: `p-${index}-${Date.now()}`,
      name,
      isImpostor: false,
    }));

    // Randomly assign impostors using unique indices
    const indices = Array.from({ length: playerObjects.length }, (_, i) => i);
    // Ensure we don't try to pick more impostors than players (though UI handles this)
    const finalImpostorCount = Math.min(impostorCount, playerObjects.length - 1);
    
    for (let i = 0; i < finalImpostorCount; i++) {
      const randomIndex = Math.floor(Math.random() * indices.length);
      const playerIndex = indices.splice(randomIndex, 1)[0];
      playerObjects[playerIndex].isImpostor = true;
    }

    setGameConfig({
      players: playerObjects,
      secretWord,
      category: langData.name,
      impostorCount: finalImpostorCount,
    });
    setScreen(GameScreen.REVEAL);
  }, [players, lang]);

  const resetGame = useCallback(() => {
    setScreen(GameScreen.HOME);
    setGameConfig(null);
  }, []);

  const GlobalLanguageSwitcher = () => (
    <div className="flex justify-center items-center py-2 px-4 z-50">
      <div className="flex bg-slate-800/60 backdrop-blur-md p-1 rounded-full border border-slate-700/50 shadow-lg scale-90">
        {(['en', 'pt', 'es'] as Language[]).map(l => (
          <button
            key={l}
            onClick={() => {
              playSound.tap();
              setLang(l);
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter transition-all ${
              lang === l 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case GameScreen.HOME:
        return <HomeScreen onStart={() => setScreen(GameScreen.PLAYER_SETUP)} t={t} />;
      case GameScreen.PLAYER_SETUP:
        return (
          <PlayerSetup 
            players={players} 
            setPlayers={setPlayers} 
            onNext={() => setScreen(GameScreen.GAME_SETTINGS)}
            onBack={() => setScreen(GameScreen.HOME)}
            t={t}
          />
        );
      case GameScreen.GAME_SETTINGS:
        return (
          <GameSettings 
            playerCount={players.length}
            onStart={startGame}
            onBack={() => setScreen(GameScreen.PLAYER_SETUP)}
            t={t}
            lang={lang}
          />
        );
      case GameScreen.REVEAL:
        if (!gameConfig) return null;
        return (
          <RevealPhase 
            config={gameConfig} 
            onFinish={() => setScreen(GameScreen.DISCUSSION)} 
            t={t}
          />
        );
      case GameScreen.DISCUSSION:
        return (
          <DiscussionPhase 
            onReveal={() => setScreen(GameScreen.RESULT)} 
            t={t}
          />
        );
      case GameScreen.RESULT:
        if (!gameConfig) return null;
        return (
          <ResultPhase 
            config={gameConfig} 
            onRestart={resetGame} 
            t={t}
          />
        );
      default:
        return <HomeScreen onStart={() => setScreen(GameScreen.PLAYER_SETUP)} t={t} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 text-slate-100 flex flex-col overflow-hidden selection:bg-indigo-500/30">
      <GlobalLanguageSwitcher />
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;
