import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Gamepad2, 
  BookOpen, 
  Target, 
  Puzzle, 
  Sword,
  Trophy,
  Users,
  Clock,
  Star,
  Zap,
  Play,
  ChevronRight,
  Dice1,
  Grid3X3,
  Type,
  Calculator,
  Brain,
  Hash,
  FlaskConical,
  Globe,
  Dumbbell,
  Film,
  Diamond,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const GameTypeSelector: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('board');

  const gameCategories = {
    board: {
      title: 'Board Games',
      icon: <Crown className="w-6 h-6" />,
      color: 'text-blue-400',
      games: [
        {
          id: 'chess',
          title: 'Chess',
          subtitle: 'The classic strategy game',
          icon: <Crown className="w-8 h-8 text-blue-400" />,
          players: '2 players',
          difficulty: 'Advanced',
          route: '/chess',
          featured: true,
          available: true,
          description: 'Master the ultimate strategy game with tournaments, puzzles, and analysis tools.'
        },
        {
          id: 'checkers',
          title: 'Checkers',
          subtitle: 'Traditional board strategy',
          icon: <Gamepad2 className="w-8 h-8 text-red-400" />,
          players: '2 players',
          difficulty: 'Intermediate',
          route: '/checkers',
          available: false,
          description: 'Classic checkers with multiple variants and difficulty levels.'
        },
        {
          id: 'go',
          title: 'Go',
          subtitle: 'Ancient territory game',
          icon: <Target className="w-8 h-8 text-green-400" />,
          players: '2 players',
          difficulty: 'Expert',
          route: '/go',
          available: false,
          description: 'The ancient game of territorial strategy and pattern recognition.'
        },
        {
          id: 'reversi',
          title: 'Reversi',
          subtitle: 'Flip to win',
          icon: <Dice1 className="w-8 h-8 text-purple-400" />,
          players: '2 players',
          difficulty: 'Beginner',
          route: '/reversi',
          available: false,
          description: 'Strategic disc-flipping game also known as Othello.'
        }
      ]
    },
    puzzles: {
      title: 'Word & Logic Puzzles',
      icon: <Puzzle className="w-6 h-6" />,
      color: 'text-green-400',
      games: [
        {
          id: 'sudoku',
          title: 'Sudoku',
          subtitle: 'Number placement puzzle',
          icon: <Grid3X3 className="w-8 h-8 text-green-400" />,
          players: '1 player',
          difficulty: 'Variable',
          route: '/sudoku',
          featured: true,
          available: true,
          description: 'Classic number puzzles with multiple difficulty levels and daily challenges.'
        },
        {
          id: 'daily-word',
          title: 'Daily Word Puzzle',
          subtitle: 'Daily word challenges',
          icon: <Type className="w-8 h-8 text-purple-400" />,
          players: '1 player',
          difficulty: 'Variable',
          route: '/daily-word',
          featured: true,
          available: true,
          description: 'Daily word puzzles with varying difficulty and AI-generated content.'
        },
        {
          id: 'crossword',
          title: 'Crossword',
          subtitle: 'Word clue puzzles',
          icon: <BookOpen className="w-8 h-8 text-blue-400" />,
          players: '1 player',
          difficulty: 'Variable',
          route: '/crossword',
          available: false,
          description: 'Daily crossword puzzles with varying themes and difficulty.'
        },
        {
          id: 'anagram',
          title: 'Anagram Solver',
          subtitle: 'Rearrange letters',
          icon: <Puzzle className="w-8 h-8 text-orange-400" />,
          players: '1 player',
          difficulty: 'Variable',
          route: '/anagram',
          available: false,
          description: 'Find words by rearranging letters with time challenges.'
        }
      ]
    },
    card: {
      title: 'Card Games',
      icon: <Diamond className="w-6 h-6" />,
      color: 'text-red-400',
      games: [
        {
          id: 'solitaire',
          title: 'Solitaire',
          subtitle: 'Classic card game',
          icon: <Diamond className="w-8 h-8 text-red-400" />,
          players: '1 player',
          difficulty: 'Beginner',
          route: '/solitaire',
          available: false,
          description: 'Multiple solitaire variants including Klondike and Spider.'
        },
        {
          id: 'hearts',
          title: 'Hearts',
          subtitle: 'Trick-taking game',
          icon: <Heart className="w-8 h-8 text-red-400" />,
          players: '4 players',
          difficulty: 'Intermediate',
          route: '/hearts',
          available: false,
          description: 'Avoid hearts and the Queen of Spades in this strategic card game.'
        }
      ]
    },
    trivia: {
      title: 'Trivia & Knowledge',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-purple-400',
      games: [
        {
          id: 'quiz',
          title: 'Multi-Topic Quiz',
          subtitle: 'Test your knowledge',
          icon: <Brain className="w-8 h-8 text-purple-400" />,
          players: '1-4 players',
          difficulty: 'Variable',
          route: '/quiz',
          featured: true,
          available: true,
          description: 'Thousands of questions across science, history, sports, and more.'
        },
        {
          id: 'math-challenge',
          title: 'Math Challenge',
          subtitle: 'Number skills test',
          icon: <Calculator className="w-8 h-8 text-blue-400" />,
          players: '1 player',
          difficulty: 'Variable',
          route: '/math-challenge',
          available: false,
          description: 'Speed math challenges and problem-solving exercises.'
        },
        {
          id: 'geography',
          title: 'Geography Quiz',
          subtitle: 'World knowledge',
          icon: <Globe className="w-8 h-8 text-green-400" />,
          players: '1-4 players',
          difficulty: 'Intermediate',
          route: '/geography',
          available: false,
          description: 'Test your knowledge of countries, capitals, and landmarks.'
        }
      ]
    }
  };

  const handleGameSelect = (game: any) => {
    if (game.available) {
      navigate(game.route);
    } else {
      toast.info(`${game.title} coming soon!`, {
        description: 'We\'re working on bringing you more amazing games.',
        duration: 3000,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const currentCategory = gameCategories[selectedCategory as keyof typeof gameCategories];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-4">
          <Gamepad2 className="w-12 h-12 text-[#759900] mr-3" />
          <h1 className="text-4xl font-bold text-white">Choose Your Game</h1>
        </div>
        <p className="text-[#b8b8b8] text-lg">Master multiple games, challenge your mind, compete with others</p>
      </div>

      {/* Category Selector */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-[#2c2c28] rounded-lg p-2">
          {Object.entries(gameCategories).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "ghost"}
              className={`flex items-center space-x-2 ${
                selectedCategory === key
                  ? 'bg-[#759900] hover:bg-[#6a8700] text-white'
                  : 'text-[#b8b8b8] hover:bg-[#4a4a46] hover:text-white'
              }`}
              onClick={() => setSelectedCategory(key)}
            >
              <span className={category.color}>{category.icon}</span>
              <span>{category.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentCategory.games.map((game) => (
          <Card key={game.id} className="bg-[#2c2c28] border-[#4a4a46] hover:border-[#759900] transition-all duration-300 cursor-pointer group relative">
            {/* Coming Soon Overlay */}
            {!game.available && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                <Badge className="bg-yellow-600 text-white text-sm">Coming Soon</Badge>
              </div>
            )}
            
            <div className="p-6 space-y-4">
              {/* Game Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex justify-center items-center">{game.icon}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold text-lg">{game.title}</h3>
                      {game.featured && (
                        <Badge className="bg-[#759900] text-white text-xs">Featured</Badge>
                      )}
                      {game.available && (
                        <Badge className="bg-green-600 text-white text-xs">Available</Badge>
                      )}
                    </div>
                    <p className="text-[#b8b8b8] text-sm">{game.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#b8b8b8] group-hover:text-[#759900] transition-colors" />
              </div>

              {/* Game Info */}
              <div className="space-y-3">
                <p className="text-[#b8b8b8] text-sm leading-relaxed">{game.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-[#b8b8b8]" />
                      <span className="text-[#b8b8b8]">{game.players}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(game.difficulty)}`}></div>
                      <span className="text-[#b8b8b8]">{game.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <Button
                onClick={() => handleGameSelect(game)}
                className={`w-full ${
                  game.available 
                    ? 'bg-[#759900] hover:bg-[#6a8700] text-white group-hover:shadow-lg' 
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300 cursor-not-allowed'
                } transition-all duration-300`}
                disabled={!game.available}
              >
                <Play className="w-4 h-4 mr-2" />
                {game.available ? 'Play Now' : 'Coming Soon'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="bg-[#2c2c28] border-[#4a4a46] p-4 text-center">
          <div className="text-2xl font-bold text-[#759900]">4</div>
          <div className="text-[#b8b8b8] text-sm">Available Games</div>
        </Card>
        <Card className="bg-[#2c2c28] border-[#4a4a46] p-4 text-center">
          <div className="text-2xl font-bold text-[#759900]">12+</div>
          <div className="text-[#b8b8b8] text-sm">Total Planned</div>
        </Card>
        <Card className="bg-[#2c2c28] border-[#4a4a46] p-4 text-center">
          <div className="text-2xl font-bold text-[#759900]">50K+</div>
          <div className="text-[#b8b8b8] text-sm">Active Players</div>
        </Card>
        <Card className="bg-[#2c2c28] border-[#4a4a46] p-4 text-center">
          <div className="text-2xl font-bold text-[#759900]">24/7</div>
          <div className="text-[#b8b8b8] text-sm">Online Play</div>
        </Card>
      </div>
    </div>
  );
};

export default GameTypeSelector;
