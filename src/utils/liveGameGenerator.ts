
import { getRandomLiveGame } from './sampleGames';

export interface LiveGame {
  id: number;
  white: { name: string; rating: number; title: string };
  black: { name: string; rating: number; title: string };
  timeControl: string;
  category: string;
  viewers: number;
  moves: number;
  isTopGame: boolean;
  position: string; // FEN string
  timeLeft: { white: number; black: number };
  currentPlayer: 'white' | 'black';
  gameStatus: 'active' | 'finished';
  result?: 'white' | 'black' | 'draw';
}

// Sample starting positions for realistic games
const samplePositions = [
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Starting position
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', // e4
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2', // e4 e5
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', // e4 e5 Nf3
  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', // e4 e5 Nf3 Nc6
  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', // Spanish Opening
  'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', // Italian Game setup
  'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', // Italian Game
  'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', // Italian Game developed
  'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', // Italian vs Italian
];

export const generateLiveGame = (): LiveGame => {
  const baseGame = getRandomLiveGame();
  const timeControls = {
    '1+0': { white: 60, black: 60 },
    '3+0': { white: 180, black: 180 },
    '3+2': { white: 180, black: 180 },
    '5+0': { white: 300, black: 300 },
    '10+0': { white: 600, black: 600 },
    '15+10': { white: 900, black: 900 }
  };

  const baseTime = timeControls[baseGame.timeControl] || { white: 300, black: 300 };
  const gameProgress = Math.random(); // 0 = just started, 1 = nearly finished
  
  return {
    id: Math.random(),
    white: baseGame.white,
    black: baseGame.black,
    timeControl: baseGame.timeControl,
    category: baseGame.category,
    viewers: baseGame.viewers,
    moves: Math.floor(gameProgress * 40) + Math.floor(Math.random() * 20),
    isTopGame: baseGame.isTopGame,
    position: samplePositions[Math.floor(Math.random() * samplePositions.length)],
    timeLeft: {
      white: Math.floor(baseTime.white * (0.3 + Math.random() * 0.7)),
      black: Math.floor(baseTime.black * (0.3 + Math.random() * 0.7))
    },
    currentPlayer: Math.random() > 0.5 ? 'white' : 'black',
    gameStatus: Math.random() > 0.9 ? 'finished' : 'active',
    result: Math.random() > 0.8 ? (['white', 'black', 'draw'][Math.floor(Math.random() * 3)] as 'white' | 'black' | 'draw') : undefined
  };
};

export const updateLiveGame = (game: LiveGame): LiveGame => {
  // Simulate game progression
  const shouldMakeMove = Math.random() > 0.7;
  const shouldUpdateTime = Math.random() > 0.3;
  
  let newGame = { ...game };
  
  if (shouldMakeMove && game.gameStatus === 'active') {
    newGame.moves += 1;
    newGame.currentPlayer = newGame.currentPlayer === 'white' ? 'black' : 'white';
    
    // Randomly advance to next position
    if (Math.random() > 0.8) {
      const currentIndex = samplePositions.indexOf(game.position);
      if (currentIndex < samplePositions.length - 1 && currentIndex >= 0) {
        newGame.position = samplePositions[currentIndex + 1];
      }
    }
  }
  
  if (shouldUpdateTime && game.gameStatus === 'active') {
    // Decrease time for current player
    const timeDecrease = Math.floor(Math.random() * 10) + 5;
    if (newGame.currentPlayer === 'white') {
      newGame.timeLeft.white = Math.max(0, newGame.timeLeft.white - timeDecrease);
    } else {
      newGame.timeLeft.black = Math.max(0, newGame.timeLeft.black - timeDecrease);
    }
    
    // Check for time out
    if (newGame.timeLeft.white === 0 || newGame.timeLeft.black === 0) {
      newGame.gameStatus = 'finished';
      newGame.result = newGame.timeLeft.white === 0 ? 'black' : 'white';
    }
  }
  
  // Randomly finish some games
  if (Math.random() > 0.995 && game.gameStatus === 'active') {
    newGame.gameStatus = 'finished';
    newGame.result = ['white', 'black', 'draw'][Math.floor(Math.random() * 3)] as 'white' | 'black' | 'draw';
  }
  
  // Update viewer count
  newGame.viewers = Math.max(50, newGame.viewers + Math.floor(Math.random() * 21) - 10);
  
  return newGame;
};

export const createLiveGamePool = (count: number = 8): LiveGame[] => {
  return Array.from({ length: count }, generateLiveGame);
};
