
export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'swiss' | 'roundRobin' | 'elimination' | 'arena';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  timeControl: string;
  startTime: string;
  endTime?: string;
  maxPlayers: number;
  currentPlayers: number;
  entryFee?: number;
  prizePool?: number;
  rounds: TournamentRound[];
  participants: TournamentPlayer[];
  settings: TournamentSettings;
  creator: string;
  isRated: boolean;
  minRating?: number;
  maxRating?: number;
}

export interface TournamentPlayer {
  id: string;
  username: string;
  rating: number;
  title?: string;
  score: number;
  tiebreak: number;
  gamesPlayed: number;
  performance: number;
  status: 'active' | 'withdrawn' | 'eliminated';
  joinedAt: string;
}

export interface TournamentRound {
  roundNumber: number;
  pairings: TournamentPairing[];
  startTime: string;
  endTime?: string;
  status: 'pending' | 'active' | 'completed';
}

export interface TournamentPairing {
  id: string;
  white: TournamentPlayer;
  black: TournamentPlayer;
  result?: 'white' | 'black' | 'draw';
  gameId?: string;
  startTime?: string;
  endTime?: string;
  moves?: string[];
}

export interface TournamentSettings {
  timeControl: string;
  increment: number;
  roundDuration: number; // minutes
  pairingSystem: 'swiss' | 'roundRobin';
  tiebreakMethods: ('buchholz' | 'sonneborn' | 'rating' | 'direct')[];
  allowByes: boolean;
  maxRounds?: number;
}

class TournamentManager {
  private tournaments: Map<string, Tournament> = new Map();
  private storageKey = 'chess-tournaments';

  constructor() {
    this.loadTournaments();
    this.createSampleTournaments();
  }

  private loadTournaments() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const tournamentData = JSON.parse(stored);
        Object.entries(tournamentData).forEach(([id, tournament]) => {
          this.tournaments.set(id, tournament as Tournament);
        });
      }
    } catch (error) {
      console.error('Error loading tournaments:', error);
    }
  }

  private saveTournaments() {
    try {
      const tournamentData = Object.fromEntries(this.tournaments);
      localStorage.setItem(this.storageKey, JSON.stringify(tournamentData));
    } catch (error) {
      console.error('Error saving tournaments:', error);
    }
  }

  private createSampleTournaments() {
    if (this.tournaments.size === 0) {
      const sampleTournaments: Tournament[] = [
        {
          id: 'weekly-blitz-1',
          name: 'Weekly Blitz Championship',
          description: 'Fast-paced 5+3 blitz tournament for all skill levels',
          type: 'swiss',
          status: 'active',
          timeControl: '5+3',
          startTime: new Date(Date.now() - 3600000).toISOString(),
          maxPlayers: 100,
          currentPlayers: 87,
          prizePool: 500,
          rounds: [],
          participants: [],
          settings: {
            timeControl: '5+3',
            increment: 3,
            roundDuration: 15,
            pairingSystem: 'swiss',
            tiebreakMethods: ['buchholz', 'sonneborn', 'rating'],
            allowByes: true,
            maxRounds: 7
          },
          creator: 'ChessOrg',
          isRated: true,
          minRating: 1200
        },
        {
          id: 'rapid-masters-2',
          name: 'Rapid Masters Arena',
          description: 'Elite tournament for masters and above',
          type: 'arena',
          status: 'upcoming',
          timeControl: '15+10',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          maxPlayers: 50,
          currentPlayers: 23,
          entryFee: 25,
          prizePool: 1000,
          rounds: [],
          participants: [],
          settings: {
            timeControl: '15+10',
            increment: 10,
            roundDuration: 30,
            pairingSystem: 'swiss',
            tiebreakMethods: ['rating', 'direct'],
            allowByes: false
          },
          creator: 'MasterClass',
          isRated: true,
          minRating: 2200
        },
        {
          id: 'beginners-cup-3',
          name: 'Beginners Friendly Cup',
          description: 'Perfect for new players to get tournament experience',
          type: 'roundRobin',
          status: 'upcoming',
          timeControl: '10+5',
          startTime: new Date(Date.now() + 172800000).toISOString(),
          maxPlayers: 16,
          currentPlayers: 12,
          rounds: [],
          participants: [],
          settings: {
            timeControl: '10+5',
            increment: 5,
            roundDuration: 20,
            pairingSystem: 'roundRobin',
            tiebreakMethods: ['direct', 'rating'],
            allowByes: false
          },
          creator: 'ChessClub',
          isRated: false,
          maxRating: 1400
        }
      ];

      sampleTournaments.forEach(tournament => {
        this.tournaments.set(tournament.id, tournament);
      });
      this.saveTournaments();
    }
  }

  createTournament(tournamentData: Omit<Tournament, 'id' | 'rounds' | 'participants' | 'currentPlayers'>): Tournament {
    const tournament: Tournament = {
      ...tournamentData,
      id: `tournament_${Date.now()}`,
      rounds: [],
      participants: [],
      currentPlayers: 0
    };

    this.tournaments.set(tournament.id, tournament);
    this.saveTournaments();
    return tournament;
  }

  getTournament(id: string): Tournament | undefined {
    return this.tournaments.get(id);
  }

  getAllTournaments(): Tournament[] {
    return Array.from(this.tournaments.values());
  }

  getActiveTournaments(): Tournament[] {
    return this.getAllTournaments().filter(t => t.status === 'active');
  }

  getUpcomingTournaments(): Tournament[] {
    return this.getAllTournaments().filter(t => t.status === 'upcoming');
  }

  joinTournament(tournamentId: string, player: Omit<TournamentPlayer, 'score' | 'tiebreak' | 'gamesPlayed' | 'performance' | 'status' | 'joinedAt'>): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    if (tournament.currentPlayers >= tournament.maxPlayers) return false;
    if (tournament.status !== 'upcoming') return false;

    // Check rating requirements
    if (tournament.minRating && player.rating < tournament.minRating) return false;
    if (tournament.maxRating && player.rating > tournament.maxRating) return false;

    // Check if player already joined
    if (tournament.participants.some(p => p.id === player.id)) return false;

    const tournamentPlayer: TournamentPlayer = {
      ...player,
      score: 0,
      tiebreak: 0,
      gamesPlayed: 0,
      performance: player.rating,
      status: 'active',
      joinedAt: new Date().toISOString()
    };

    tournament.participants.push(tournamentPlayer);
    tournament.currentPlayers++;

    this.saveTournaments();
    return true;
  }

  startTournament(tournamentId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || tournament.status !== 'upcoming') return false;

    if (tournament.participants.length < 2) return false;

    tournament.status = 'active';
    tournament.startTime = new Date().toISOString();

    // Create first round pairings
    this.createNextRound(tournamentId);

    this.saveTournaments();
    return true;
  }

  private createNextRound(tournamentId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    const activePlayers = tournament.participants.filter(p => p.status === 'active');
    if (activePlayers.length < 2) return false;

    const roundNumber = tournament.rounds.length + 1;
    const pairings = this.generatePairings(activePlayers, tournament.settings.pairingSystem);

    const round: TournamentRound = {
      roundNumber,
      pairings,
      startTime: new Date().toISOString(),
      status: 'active'
    };

    tournament.rounds.push(round);
    this.saveTournaments();
    return true;
  }

  private generatePairings(players: TournamentPlayer[], system: 'swiss' | 'roundRobin'): TournamentPairing[] {
    const pairings: TournamentPairing[] = [];

    if (system === 'swiss') {
      // Sort by score, then by tiebreak, then by rating
      const sortedPlayers = [...players].sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        if (a.tiebreak !== b.tiebreak) return b.tiebreak - a.tiebreak;
        return b.rating - a.rating;
      });

      // Pair adjacent players in score groups
      for (let i = 0; i < sortedPlayers.length - 1; i += 2) {
        const white = sortedPlayers[i];
        const black = sortedPlayers[i + 1];

        pairings.push({
          id: `pairing_${Date.now()}_${i}`,
          white,
          black
        });
      }

      // Handle odd number of players (bye)
      if (sortedPlayers.length % 2 === 1) {
        // The lowest-scored player gets a bye
        const byePlayer = sortedPlayers[sortedPlayers.length - 1];
        byePlayer.score += 1; // Award a point for the bye
      }
    }

    return pairings;
  }

  recordGameResult(tournamentId: string, pairingId: string, result: 'white' | 'black' | 'draw', gameData?: any): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    const currentRound = tournament.rounds[tournament.rounds.length - 1];
    if (!currentRound) return false;

    const pairing = currentRound.pairings.find(p => p.id === pairingId);
    if (!pairing || pairing.result) return false;

    pairing.result = result;
    pairing.endTime = new Date().toISOString();

    // Update player scores
    if (result === 'white') {
      pairing.white.score += 1;
    } else if (result === 'black') {
      pairing.black.score += 1;
    } else {
      pairing.white.score += 0.5;
      pairing.black.score += 0.5;
    }

    pairing.white.gamesPlayed++;
    pairing.black.gamesPlayed++;

    // Update performance ratings
    this.updatePerformanceRatings(tournament, pairing, result);

    // Check if round is complete
    if (currentRound.pairings.every(p => p.result)) {
      currentRound.status = 'completed';
      currentRound.endTime = new Date().toISOString();

      // Check if tournament should continue or end
      if (this.shouldContinueTournament(tournament)) {
        this.createNextRound(tournamentId);
      } else {
        tournament.status = 'completed';
        tournament.endTime = new Date().toISOString();
      }
    }

    this.saveTournaments();
    return true;
  }

  private updatePerformanceRatings(tournament: Tournament, pairing: TournamentPairing, result: 'white' | 'black' | 'draw') {
    // Simplified performance rating calculation
    const K = 32; // Rating change factor
    const whiteExpected = 1 / (1 + Math.pow(10, (pairing.black.rating - pairing.white.rating) / 400));
    const blackExpected = 1 - whiteExpected;

    let whiteScore = 0.5;
    let blackScore = 0.5;

    if (result === 'white') {
      whiteScore = 1;
      blackScore = 0;
    } else if (result === 'black') {
      whiteScore = 0;
      blackScore = 1;
    }

    const whiteChange = K * (whiteScore - whiteExpected);
    const blackChange = K * (blackScore - blackExpected);

    pairing.white.performance += whiteChange;
    pairing.black.performance += blackChange;
  }

  private shouldContinueTournament(tournament: Tournament): boolean {
    const activePlayers = tournament.participants.filter(p => p.status === 'active').length;
    
    if (tournament.type === 'swiss') {
      const maxRounds = tournament.settings.maxRounds || Math.ceil(Math.log2(activePlayers));
      return tournament.rounds.length < maxRounds && activePlayers > 1;
    }
    
    if (tournament.type === 'roundRobin') {
      return tournament.rounds.length < (activePlayers - 1);
    }
    
    return false;
  }

  getTournamentStandings(tournamentId: string): TournamentPlayer[] {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return [];

    return [...tournament.participants]
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        if (a.tiebreak !== b.tiebreak) return b.tiebreak - a.tiebreak;
        return b.rating - a.rating;
      })
      .map((player, index) => ({ ...player, position: index + 1 }));
  }

  calculateTiebreaks(tournamentId: string) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return;

    // Calculate various tiebreak systems
    tournament.participants.forEach(player => {
      player.tiebreak = this.calculateBuchholz(tournament, player);
    });

    this.saveTournaments();
  }

  private calculateBuchholz(tournament: Tournament, player: TournamentPlayer): number {
    // Sum of opponents' scores
    let buchholz = 0;
    let opponents = 0;

    tournament.rounds.forEach(round => {
      round.pairings.forEach(pairing => {
        if (pairing.white.id === player.id) {
          buchholz += pairing.black.score;
          opponents++;
        } else if (pairing.black.id === player.id) {
          buchholz += pairing.white.score;
          opponents++;
        }
      });
    });

    return opponents > 0 ? buchholz / opponents : 0;
  }
}

export const tournamentManager = new TournamentManager();
