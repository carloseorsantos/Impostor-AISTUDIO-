
import React, { useState, useCallback, useEffect } from 'react';
import { GameScreen, Player, GameConfig, Language } from './types.ts';
import { CATEGORIES } from './constants.tsx';
import { UI_STRINGS } from './i18n.ts';
import { playSound } from './utils/sounds.ts';
import HomeScreen from './components/HomeScreen.tsx';
import PlayerSetup from './components/PlayerSetup.tsx';
import GameSettings from './components/GameSettings.tsx';
import RevealPhase from './components/RevealPhase.tsx';
import DiscussionPhase from './components/DiscussionPhase.tsx';
import ResultPhase from './components/ResultPhase.tsx';

const App: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>(GameScreen.HOME);
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2', 'Player 3']);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [lang, setLang] = useState<Language>('en');

  const t = UI_STRINGS[lang];

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
    
    const playerObjects: Player[] = players.map((name, index) => ({
      id: `p-${index}`,
      name,
      isImpostor: false,
    }));

    const indices = Array.from({ length: playerObjects.length }, (_, i) => i);
    for (let i = 0; i < impostorCount; i++) {
      const randomIndex = Math.floor(Math.random() * indices.length);
      const playerIndex = indices.splice(randomIndex, 1)[0];
      playerObjects[playerIndex].isImpostor = true;
    }

    setGameConfig({
      players: playerObjects,
      secretWord,
      category: langData.name,
      impostorCount,
    });
    setScreen(GameScreen.REVEAL);
  }, [players, lang]);

  const resetGame = useCallback(() => {
    setScreen(GameScreen.HOME);
    setGameConfig(null);
  }, []);

  const LanguageSwitcher = () => (
    <div className="flex justify-center gap-2 mb-4 animate-in fade-in duration-700">
      {(['en', 'pt', 'es'] as Language[]).map(l => (
        <button
          key={l}
          onClick={() => {
            playSound.tap();
            setLang(l);
          }}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
            lang === l 
              ? 'bg-indigo-600 border-indigo-500 text-white' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col p-4 md:p-8 max-w-lg mx-auto overflow-hidden">
      {screen === GameScreen.HOME && <LanguageSwitcher />}
      {renderScreen()}
    </div>
  );
};

export default App;
