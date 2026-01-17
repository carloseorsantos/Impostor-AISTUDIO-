
export enum GameScreen {
  HOME = 'HOME',
  PLAYER_SETUP = 'PLAYER_SETUP',
  GAME_SETTINGS = 'GAME_SETTINGS',
  REVEAL = 'REVEAL',
  DISCUSSION = 'DISCUSSION',
  RESULT = 'RESULT'
}

export type Language = 'en' | 'pt' | 'es';

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
}

export interface Category {
  id: string;
  icon: string;
  translations: {
    [key in Language]: {
      name: string;
      words: string[];
    };
  };
}

export interface GameConfig {
  players: Player[];
  secretWord: string;
  category: string;
  impostorCount: number;
}
