import { StoredGame } from './gameDatabase';

export const sampleGames: StoredGame[] = [
  {
    id: 'game_001',
    playerWhite: 'Magnus Carlsen',
    playerBlack: 'Hikaru Nakamura',
    result: 'white',
    moves: [
      { 
        from: { x: 4, y: 6 }, 
        to: { x: 4, y: 4 }, 
        notation: 'e4', 
        captured: null,
        piece: { type: 'pawn', color: 'white', position: { x: 4, y: 6 } },
        timestamp: new Date('2024-01-15T10:00:01Z')
      },
      { 
        from: { x: 4, y: 1 }, 
        to: { x: 4, y: 3 }, 
        notation: 'e5', 
        captured: null,
        piece: { type: 'pawn', color: 'black', position: { x: 4, y: 1 } },
        timestamp: new Date('2024-01-15T10:00:03Z')
      },
      { 
        from: { x: 6, y: 7 }, 
        to: { x: 5, y: 5 }, 
        notation: 'Nf3', 
        captured: null,
        piece: { type: 'knight', color: 'white', position: { x: 6, y: 7 } },
        timestamp: new Date('2024-01-15T10:00:05Z')
      },
      { 
        from: { x: 1, y: 0 }, 
        to: { x: 2, y: 2 }, 
        notation: 'Nc6', 
        captured: null,
        piece: { type: 'knight', color: 'black', position: { x: 1, y: 0 } },
        timestamp: new Date('2024-01-15T10:00:07Z')
      },
      { 
        from: { x: 5, y: 7 }, 
        to: { x: 2, y: 4 }, 
        notation: 'Bc4', 
        captured: null,
        piece: { type: 'bishop', color: 'white', position: { x: 5, y: 7 } },
        timestamp: new Date('2024-01-15T10:00:09Z')
      },
      { 
        from: { x: 5, y: 0 }, 
        to: { x: 2, y: 3 }, 
        notation: 'Bc5', 
        captured: null,
        piece: { type: 'bishop', color: 'black', position: { x: 5, y: 0 } },
        timestamp: new Date('2024-01-15T10:00:11Z')
      },
      { 
        from: { x: 3, y: 7 }, 
        to: { x: 5, y: 5 }, 
        notation: 'Qh5', 
        captured: null,
        piece: { type: 'queen', color: 'white', position: { x: 3, y: 7 } },
        timestamp: new Date('2024-01-15T10:00:13Z')
      },
      { 
        from: { x: 6, y: 0 }, 
        to: { x: 5, y: 2 }, 
        notation: 'Nf6', 
        captured: null,
        piece: { type: 'knight', color: 'black', position: { x: 6, y: 0 } },
        timestamp: new Date('2024-01-15T10:00:15Z')
      },
      { 
        from: { x: 5, y: 5 }, 
        to: { x: 5, y: 1 }, 
        notation: 'Qxf7#', 
        captured: { type: 'pawn', color: 'black', position: { x: 5, y: 1 } },
        piece: { type: 'queen', color: 'white', position: { x: 5, y: 5 } },
        timestamp: new Date('2024-01-15T10:00:17Z')
      }
    ],
    pgn: '[Event "Speed Chess Championship"]\n[Site "Chess.com"]\n[Date "2024.01.15"]\n[Round "1"]\n[White "Magnus Carlsen"]\n[Black "Hikaru Nakamura"]\n[Result "1-0"]\n[TimeControl "180+2"]\n[Opening "Italian Game"]\n[ECO "C50"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. Qh5 Nf6 5. Qxf7# 1-0',
    fen: 'r1bqk2r/pppp1Qpp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNB1K2R b KQkq - 0 5',
    timeControl: '3+2',
    rating: { white: 2831, black: 2789 },
    date: '2024-01-15',
    opening: 'Italian Game',
    eco: 'C50',
    tags: ['Speed Chess', 'Scholar\'s Mate Variation'],
    notes: 'Classic Scholar\'s Mate pattern in blitz game',
    analysis: {
      evaluation: 999,
      accuracy: { white: 96, black: 72 },
      blunders: 1,
      mistakes: 0,
      inaccuracies: 0
    }
  },
  {
    id: 'game_002',
    playerWhite: 'Ding Liren',
    playerBlack: 'Fabiano Caruana',
    result: 'draw',
    moves: [
      { 
        from: { x: 3, y: 6 }, 
        to: { x: 3, y: 4 }, 
        notation: 'd4', 
        captured: null,
        piece: { type: 'pawn', color: 'white', position: { x: 3, y: 6 } },
        timestamp: new Date('2024-02-10T14:00:01Z')
      },
      { 
        from: { x: 6, y: 1 }, 
        to: { x: 5, y: 2 }, 
        notation: 'Nf6', 
        captured: null,
        piece: { type: 'knight', color: 'black', position: { x: 6, y: 1 } },
        timestamp: new Date('2024-02-10T14:00:03Z')
      },
      { 
        from: { x: 2, y: 7 }, 
        to: { x: 5, y: 4 }, 
        notation: 'Bf4', 
        captured: null,
        piece: { type: 'bishop', color: 'white', position: { x: 2, y: 7 } },
        timestamp: new Date('2024-02-10T14:00:05Z')
      },
      { 
        from: { x: 4, y: 1 }, 
        to: { x: 4, y: 2 }, 
        notation: 'e6', 
        captured: null,
        piece: { type: 'pawn', color: 'black', position: { x: 4, y: 1 } },
        timestamp: new Date('2024-02-10T14:00:07Z')
      },
      { 
        from: { x: 6, y: 7 }, 
        to: { x: 5, y: 5 }, 
        notation: 'Nf3', 
        captured: null,
        piece: { type: 'knight', color: 'white', position: { x: 6, y: 7 } },
        timestamp: new Date('2024-02-10T14:00:09Z')
      },
      { 
        from: { x: 2, y: 1 }, 
        to: { x: 2, y: 3 }, 
        notation: 'c5', 
        captured: null,
        piece: { type: 'pawn', color: 'black', position: { x: 2, y: 1 } },
        timestamp: new Date('2024-02-10T14:00:11Z')
      }
    ],
    pgn: '[Event "Candidates Tournament"]\n[Site "Madrid"]\n[Date "2024.02.10"]\n[Round "8"]\n[White "Ding Liren"]\n[Black "Fabiano Caruana"]\n[Result "1/2-1/2"]\n[TimeControl "7200+30"]\n[Opening "Queen\'s Pawn Game"]\n[ECO "D02"]\n\n1. d4 Nf6 2. Bf4 e6 3. Nf3 c5 1/2-1/2',
    fen: 'rnbqkb1r/pp1p1ppp/4pn2/2p5/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq - 0 4',
    timeControl: '120+30',
    rating: { white: 2799, black: 2804 },
    date: '2024-02-10',
    opening: 'Queen\'s Pawn Game',
    eco: 'D02',
    tags: ['Candidates', 'Classical'],
    notes: 'Theoretical draw agreed after opening preparation',
    analysis: {
      evaluation: 0,
      accuracy: { white: 94, black: 95 },
      blunders: 0,
      mistakes: 0,
      inaccuracies: 1
    }
  },
  {
    id: 'game_003',
    playerWhite: 'Alireza Firouzja',
    playerBlack: 'Ian Nepomniachtchi',
    result: 'black',
    moves: [
      { 
        from: { x: 4, y: 6 }, 
        to: { x: 4, y: 4 }, 
        notation: 'e4', 
        captured: null,
        piece: { type: 'pawn', color: 'white', position: { x: 4, y: 6 } },
        timestamp: new Date('2024-01-28T16:00:01Z')
      },
      { 
        from: { x: 2, y: 1 }, 
        to: { x: 2, y: 3 }, 
        notation: 'c5', 
        captured: null,
        piece: { type: 'pawn', color: 'black', position: { x: 2, y: 1 } },
        timestamp: new Date('2024-01-28T16:00:03Z')
      },
      { 
        from: { x: 6, y: 7 }, 
        to: { x: 5, y: 5 }, 
        notation: 'Nf3', 
        captured: null,
        piece: { type: 'knight', color: 'white', position: { x: 6, y: 7 } },
        timestamp: new Date('2024-01-28T16:00:05Z')
      },
      { 
        from: { x: 3, y: 1 }, 
        to: { x: 3, y: 2 }, 
        notation: 'd6', 
        captured: null,
        piece: { type: 'pawn', color: 'black', position: { x: 3, y: 1 } },
        timestamp: new Date('2024-01-28T16:00:07Z')
      },
      { 
        from: { x: 3, y: 6 }, 
        to: { x: 3, y: 4 }, 
        notation: 'd4', 
        captured: null,
        piece: { type: 'pawn', color: 'white', position: { x: 3, y: 6 } },
        timestamp: new Date('2024-01-28T16:00:09Z')
      },
      { 
        from: { x: 2, y: 3 }, 
        to: { x: 3, y: 4 }, 
        notation: 'cxd4', 
        captured: { type: 'pawn', color: 'white', position: { x: 3, y: 4 } },
        piece: { type: 'pawn', color: 'black', position: { x: 2, y: 3 } },
        timestamp: new Date('2024-01-28T16:00:11Z')
      }
    ],
    pgn: '[Event "Tata Steel Tournament"]\n[Site "Wijk aan Zee"]\n[Date "2024.01.28"]\n[Round "12"]\n[White "Alireza Firouzja"]\n[Black "Ian Nepomniachtchi"]\n[Result "0-1"]\n[TimeControl "6000+30"]\n[Opening "Sicilian Defense"]\n[ECO "B50"]\n\n1. e4 c5 2. Nf3 d6 3. d4 cxd4 0-1',
    fen: 'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
    timeControl: '100+30',
    rating: { white: 2793, black: 2792 },
    date: '2024-01-28',
    opening: 'Sicilian Defense',
    eco: 'B50',
    tags: ['Tata Steel', 'Sicilian'],
    notes: 'Sharp Sicilian line with tactical complications',
    analysis: {
      evaluation: -45,
      accuracy: { white: 89, black: 93 },
      blunders: 1,
      mistakes: 2,
      inaccuracies: 3
    }
  }
];

export const masterGames = [
  {
    white: 'Garry Kasparov',
    black: 'Anatoly Karpov',
    year: '1984',
    opening: 'Nimzo-Indian Defense',
    result: 'white',
    moves: 42,
    event: 'World Championship'
  },
  {
    white: 'Bobby Fischer',
    black: 'Boris Spassky',
    year: '1972',
    opening: 'Queen\'s Gambit Declined',
    result: 'white',
    moves: 41,
    event: 'World Championship'
  },
  {
    white: 'Mikhail Tal',
    black: 'Mikhail Botvinnik',
    year: '1960',
    opening: 'Caro-Kann Defense',
    result: 'white',
    moves: 25,
    event: 'World Championship'
  }
];

export function getRandomLiveGame() {
  const players = [
    { name: 'Magnus', rating: 2831, title: 'GM' },
    { name: 'Hikaru', rating: 2789, title: 'GM' },
    { name: 'Fabiano', rating: 2804, title: 'GM' },
    { name: 'Ding', rating: 2799, title: 'GM' },
    { name: 'Alireza', rating: 2793, title: 'GM' },
    { name: 'Nepo', rating: 2792, title: 'GM' },
    { name: 'Anish', rating: 2781, title: 'GM' },
    { name: 'Wesley', rating: 2773, title: 'GM' },
    { name: 'Levon', rating: 2765, title: 'GM' },
    { name: 'Maxime', rating: 2763, title: 'GM' }
  ];

  const timeControls = ['1+0', '3+0', '3+2', '5+0', '10+0', '15+10'];
  const categories = ['bullet', 'blitz', 'rapid'];
  
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const white = shuffled[0];
  const black = shuffled[1];
  
  const timeControl = timeControls[Math.floor(Math.random() * timeControls.length)];
  const category = timeControl.startsWith('1') || timeControl.startsWith('3') ? 
    (timeControl.includes('+0') ? 'bullet' : 'blitz') : 
    timeControl.startsWith('5') ? 'blitz' : 'rapid';
  
  return {
    white,
    black,
    timeControl,
    category,
    viewers: Math.floor(Math.random() * 3000) + 100,
    moves: Math.floor(Math.random() * 50) + 5,
    isTopGame: Math.random() > 0.7
  };
}
