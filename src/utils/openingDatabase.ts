
export interface Opening {
  name: string;
  eco: string;
  moves: string[];
  description: string;
  frequency: number; // How common this opening is (0-100)
  winRates: {
    white: number;
    black: number;
    draw: number;
  };
}

export const openingsDatabase: Opening[] = [
  {
    name: "Italian Game",
    eco: "C50",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    description: "One of the oldest chess openings, focusing on rapid development and center control.",
    frequency: 85,
    winRates: { white: 38, black: 32, draw: 30 }
  },
  {
    name: "Ruy Lopez",
    eco: "C60",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    description: "Also known as the Spanish Opening, a classical and popular choice.",
    frequency: 92,
    winRates: { white: 40, black: 31, draw: 29 }
  },
  {
    name: "Sicilian Defense",
    eco: "B20",
    moves: ["e4", "c5"],
    description: "The most popular response to 1.e4, leading to sharp and complex positions.",
    frequency: 95,
    winRates: { white: 35, black: 37, draw: 28 }
  },
  {
    name: "French Defense",
    eco: "C00",
    moves: ["e4", "e6"],
    description: "A solid defense that leads to strategic pawn structures.",
    frequency: 75,
    winRates: { white: 36, black: 35, draw: 29 }
  },
  {
    name: "Queen's Gambit",
    eco: "D20",
    moves: ["d4", "d5", "c4"],
    description: "A classical opening offering a pawn to gain central control.",
    frequency: 88,
    winRates: { white: 39, black: 32, draw: 29 }
  },
  {
    name: "Nimzo-Indian Defense",
    eco: "E20",
    moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"],
    description: "A hypermodern defense pinning the knight and controlling key squares.",
    frequency: 80,
    winRates: { white: 37, black: 34, draw: 29 }
  },
  {
    name: "King's Indian Defense",
    eco: "E60",
    moves: ["d4", "Nf6", "c4", "g6"],
    description: "A dynamic defense allowing White to occupy the center initially.",
    frequency: 78,
    winRates: { white: 38, black: 35, draw: 27 }
  },
  {
    name: "English Opening",
    eco: "A10",
    moves: ["c4"],
    description: "A flexible opening that can transpose to many different systems.",
    frequency: 70,
    winRates: { white: 37, black: 34, draw: 29 }
  },
  {
    name: "Caro-Kann Defense",
    eco: "B10",
    moves: ["e4", "c6"],
    description: "A solid defense similar to the French but avoiding blocked positions.",
    frequency: 65,
    winRates: { white: 36, black: 35, draw: 29 }
  },
  {
    name: "Scandinavian Defense",
    eco: "B01",
    moves: ["e4", "d5"],
    description: "An immediate challenge to White's central pawn.",
    frequency: 45,
    winRates: { white: 42, black: 30, draw: 28 }
  }
];

export function detectOpening(moveNotations: string[]): Opening | null {
  if (moveNotations.length === 0) return null;

  // Find the longest matching opening
  let bestMatch: Opening | null = null;
  let maxMatchLength = 0;

  for (const opening of openingsDatabase) {
    let matchLength = 0;
    
    for (let i = 0; i < Math.min(moveNotations.length, opening.moves.length); i++) {
      if (moveNotations[i] === opening.moves[i]) {
        matchLength++;
      } else {
        break;
      }
    }

    if (matchLength > maxMatchLength && matchLength >= 2) {
      maxMatchLength = matchLength;
      bestMatch = opening;
    }
  }

  return bestMatch;
}

export function getOpeningStats(openingName: string): Opening | null {
  return openingsDatabase.find(opening => opening.name === openingName) || null;
}

export function getPopularOpenings(): Opening[] {
  return openingsDatabase
    .filter(opening => opening.frequency >= 70)
    .sort((a, b) => b.frequency - a.frequency);
}

export function getOpeningByECO(eco: string): Opening | null {
  return openingsDatabase.find(opening => opening.eco === eco) || null;
}
