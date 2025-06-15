
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Trophy, 
  Target, 
  Zap, 
  Crown, 
  Shield, 
  Swords,
  Brain,
  ChevronRight,
  TrendingUp,
  Award,
  Flame,
  Users,
  Timer,
  BookOpen,
  Play
} from 'lucide-react';

const PuzzleThemes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { id: 'all', name: 'All Themes', icon: Target },
    { id: 'tactics', name: 'Tactical Patterns', icon: Swords },
    { id: 'endgame', name: 'Endgame', icon: Crown },
    { id: 'opening', name: 'Opening Traps', icon: Zap },
    { id: 'strategy', name: 'Strategic', icon: Brain },
    { id: 'special', name: 'Special Moves', icon: Star }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'bg-gray-600' },
    { id: 'beginner', name: 'Beginner', color: 'bg-green-600' },
    { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-600' },
    { id: 'advanced', name: 'Advanced', color: 'bg-orange-600' },
    { id: 'expert', name: 'Expert', color: 'bg-red-600' }
  ];

  const themes = [
    // Tactical Patterns
    { 
      name: "Pin", 
      count: 2847, 
      difficulty: "beginner", 
      category: "tactics",
      description: "Attack a piece that cannot move without exposing a more valuable piece",
      icon: Target,
      rating: 4.8,
      completionRate: 76
    },
    { 
      name: "Fork", 
      count: 1923, 
      difficulty: "beginner", 
      category: "tactics",
      description: "Attack two or more enemy pieces simultaneously",
      icon: Swords,
      rating: 4.9,
      completionRate: 82
    },
    { 
      name: "Skewer", 
      count: 1456, 
      difficulty: "intermediate", 
      category: "tactics",
      description: "Force a valuable piece to move, exposing a less valuable piece behind",
      icon: Target,
      rating: 4.7,
      completionRate: 68
    },
    { 
      name: "Discovered Attack", 
      count: 892, 
      difficulty: "intermediate", 
      category: "tactics",
      description: "Move one piece to reveal an attack from another piece",
      icon: Zap,
      rating: 4.6,
      completionRate: 61
    },
    { 
      name: "Double Check", 
      count: 654, 
      difficulty: "advanced", 
      category: "tactics",
      description: "Give check with two pieces simultaneously",
      icon: Shield,
      rating: 4.5,
      completionRate: 54
    },
    { 
      name: "Smothered Mate", 
      count: 321, 
      difficulty: "expert", 
      category: "tactics",
      description: "Checkmate with a knight where the king is blocked by its own pieces",
      icon: Crown,
      rating: 4.9,
      completionRate: 43
    },
    
    // Endgame
    { 
      name: "King and Pawn vs King", 
      count: 567, 
      difficulty: "intermediate", 
      category: "endgame",
      description: "Master the fundamental pawn endgame techniques",
      icon: Crown,
      rating: 4.4,
      completionRate: 59
    },
    { 
      name: "Rook Endgames", 
      count: 1234, 
      difficulty: "advanced", 
      category: "endgame",
      description: "Essential rook endgame positions and techniques",
      icon: Trophy,
      rating: 4.6,
      completionRate: 52
    },
    { 
      name: "Queen vs Pawn", 
      count: 445, 
      difficulty: "advanced", 
      category: "endgame",
      description: "Complex queen endgame scenarios",
      icon: Crown,
      rating: 4.3,
      completionRate: 47
    },
    
    // Opening Traps
    { 
      name: "Scholar's Mate", 
      count: 234, 
      difficulty: "beginner", 
      category: "opening",
      description: "Learn to avoid and exploit this common beginner trap",
      icon: Zap,
      rating: 4.2,
      completionRate: 89
    },
    { 
      name: "Fried Liver Attack", 
      count: 345, 
      difficulty: "intermediate", 
      category: "opening",
      description: "Aggressive attacking patterns in the Italian Game",
      icon: Flame,
      rating: 4.7,
      completionRate: 65
    },
    { 
      name: "Queen's Gambit Traps", 
      count: 456, 
      difficulty: "advanced", 
      category: "opening",
      description: "Common traps in the Queen's Gambit opening",
      icon: Crown,
      rating: 4.5,
      completionRate: 58
    },
    
    // Strategic
    { 
      name: "Weak Squares", 
      count: 678, 
      difficulty: "intermediate", 
      category: "strategy",
      description: "Identify and exploit weak squares in the enemy position",
      icon: Brain,
      rating: 4.4,
      completionRate: 63
    },
    { 
      name: "Piece Activity", 
      count: 789, 
      difficulty: "advanced", 
      category: "strategy",
      description: "Improve piece coordination and activity",
      icon: TrendingUp,
      rating: 4.6,
      completionRate: 56
    },
    
    // Special Moves
    { 
      name: "En Passant", 
      count: 234, 
      difficulty: "beginner", 
      category: "special",
      description: "Master this special pawn capture rule",
      icon: Star,
      rating: 4.3,
      completionRate: 74
    },
    { 
      name: "Castling Puzzles", 
      count: 345, 
      difficulty: "intermediate", 
      category: "special",
      description: "When and how to castle effectively",
      icon: Shield,
      rating: 4.5,
      completionRate: 69
    },
    { 
      name: "Promotion Tactics", 
      count: 456, 
      difficulty: "advanced", 
      category: "special",
      description: "Tactical patterns involving pawn promotion",
      icon: Crown,
      rating: 4.7,
      completionRate: 51
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const difficultyObj = difficulties.find(d => d.id === difficulty);
    return difficultyObj?.color || 'bg-gray-600';
  };

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || theme.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const totalPuzzles = themes.reduce((sum, theme) => sum + theme.count, 0);
  const averageRating = (themes.reduce((sum, theme) => sum + theme.rating, 0) / themes.length).toFixed(1);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                      <Target className="w-8 h-8 mr-3 text-[#759900]" />
                      Puzzle Themes
                    </h1>
                    <p className="text-[#b8b8b8] text-lg">Master chess tactics through focused practice</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-[#2c2c28] rounded-lg p-4 text-center border border-[#4a4a46]">
                      <div className="text-2xl font-bold text-[#759900]">{totalPuzzles.toLocaleString()}</div>
                      <div className="text-sm text-[#b8b8b8]">Total Puzzles</div>
                    </div>
                    <div className="bg-[#2c2c28] rounded-lg p-4 text-center border border-[#4a4a46]">
                      <div className="text-2xl font-bold text-[#f39c12] flex items-center justify-center">
                        <Star className="w-5 h-5 mr-1" />
                        {averageRating}
                      </div>
                      <div className="text-sm text-[#b8b8b8]">Avg Rating</div>
                    </div>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4a4a46]" />
                    <Input
                      placeholder="Search puzzle themes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#2c2c28] border-[#4a4a46] text-[#b8b8b8] placeholder:text-[#4a4a46] focus:border-[#759900]"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id 
                          ? "bg-[#759900] text-white hover:bg-[#6a8700]" 
                          : "border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]"
                        }
                      >
                        <category.icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty.id}
                      variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                      className={selectedDifficulty === difficulty.id 
                        ? "bg-[#759900] text-white hover:bg-[#6a8700]" 
                        : "border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]"
                      }
                    >
                      {difficulty.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Themes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredThemes.map((theme) => (
                  <Card key={theme.name} className="bg-[#2c2c28] border-[#4a4a46] hover:bg-[#3d3d37] transition-all duration-200 hover:scale-105 cursor-pointer group">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#759900] to-[#5a7300] rounded-lg flex items-center justify-center">
                            <theme.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-[#759900] transition-colors">
                              {theme.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`${getDifficultyColor(theme.difficulty)} text-white text-xs`}>
                                {theme.difficulty.charAt(0).toUpperCase() + theme.difficulty.slice(1)}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-[#f39c12]" />
                                <span className="text-xs text-[#b8b8b8]">{theme.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[#b8b8b8] text-sm mb-4 leading-relaxed">
                        {theme.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4 text-[#759900]" />
                            <span className="text-[#b8b8b8]">{theme.count} puzzles</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-[#3498db]" />
                            <span className="text-[#b8b8b8]">{theme.completionRate}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-[#b8b8b8] mb-1">
                          <span>Completion Rate</span>
                          <span>{theme.completionRate}%</span>
                        </div>
                        <div className="w-full bg-[#4a4a46] rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#759900] to-[#6a8700] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${theme.completionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-[#759900] to-[#6a8700] hover:from-[#6a8700] hover:to-[#5a7300] text-white font-semibold"
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Training
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]"
                        >
                          <Timer className="w-4 h-4 mr-2" />
                          Timed
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {filteredThemes.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-[#4a4a46] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#b8b8b8] mb-2">No themes found</h3>
                  <p className="text-[#4a4a46]">Try adjusting your search or filters</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-12 bg-[#2c2c28] border border-[#4a4a46] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-[#759900]" />
                  Quick Start Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="bg-gradient-to-r from-[#759900] to-[#6a8700] hover:from-[#6a8700] hover:to-[#5a7300] text-white h-12">
                    <Flame className="w-4 h-4 mr-2" />
                    Mixed Training
                  </Button>
                  <Button variant="outline" className="border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] h-12">
                    <Timer className="w-4 h-4 mr-2" />
                    Speed Run
                  </Button>
                  <Button variant="outline" className="border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] h-12">
                    <Trophy className="w-4 h-4 mr-2" />
                    Daily Challenge
                  </Button>
                  <Button variant="outline" className="border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] h-12">
                    <Award className="w-4 h-4 mr-2" />
                    Achievements
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PuzzleThemes;
