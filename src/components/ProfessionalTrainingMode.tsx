
import React, { useState, useEffect } from 'react';
import { GameState, Position } from '../types/chess';
import { enhancedChessEngine } from '../utils/enhancedChessEngine';
import { toast } from 'sonner';
import { GraduationCap, Target, Brain, BookOpen, Trophy, Star, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TrainingModule {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  category: 'tactics' | 'endgame' | 'opening' | 'strategy';
  lessons: TrainingLesson[];
  requiredRating: number;
  completionReward: number;
}

interface TrainingLesson {
  id: string;
  title: string;
  objective: string;
  positions: string[]; // FEN positions
  solution: string[];
  explanation: string;
  timeLimit?: number;
  points: number;
}

interface ProfessionalTrainingModeProps {
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
  isActive: boolean;
}

const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'basic-tactics',
    name: 'Basic Tactics',
    description: 'Learn fundamental tactical patterns',
    difficulty: 'beginner',
    category: 'tactics',
    requiredRating: 0,
    completionReward: 100,
    lessons: [
      {
        id: 'pin-basics',
        title: 'The Pin',
        objective: 'Learn to identify and execute pins',
        positions: [
          'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4'
        ],
        solution: ['Bg5'],
        explanation: 'A pin immobilizes a piece by attacking it while it shields a more valuable piece.',
        timeLimit: 60,
        points: 25
      },
      {
        id: 'fork-basics',
        title: 'The Fork',
        objective: 'Master the art of forking',
        positions: [
          'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4'
        ],
        solution: ['Ng5'],
        explanation: 'A fork attacks two or more enemy pieces simultaneously.',
        timeLimit: 90,
        points: 30
      }
    ]
  },
  {
    id: 'endgame-mastery',
    name: 'Endgame Mastery',
    description: 'Master essential endgame techniques',
    difficulty: 'intermediate',
    category: 'endgame',
    requiredRating: 1200,
    completionReward: 200,
    lessons: [
      {
        id: 'king-pawn-endgame',
        title: 'King and Pawn vs King',
        objective: 'Learn basic pawn promotion techniques',
        positions: [
          '8/8/8/4k3/8/4K3/4P3/8 w - - 0 1'
        ],
        solution: ['Kd4', 'e4', 'e5+', 'Kf6', 'Kd5'],
        explanation: 'The key is to support your pawn while keeping the enemy king at bay.',
        timeLimit: 180,
        points: 50
      }
    ]
  },
  {
    id: 'strategic-concepts',
    name: 'Strategic Concepts',
    description: 'Understand positional chess principles',
    difficulty: 'advanced',
    category: 'strategy',
    requiredRating: 1600,
    completionReward: 300,
    lessons: [
      {
        id: 'weak-squares',
        title: 'Identifying Weak Squares',
        objective: 'Learn to exploit weaknesses in pawn structure',
        positions: [
          'r1bqkb1r/ppp2ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5'
        ],
        solution: ['Ng5', 'Nxf7'],
        explanation: 'Weak squares cannot be defended by pawns and become excellent outposts.',
        timeLimit: 300,
        points: 75
      }
    ]
  }
];

export const ProfessionalTrainingMode: React.FC<ProfessionalTrainingModeProps> = ({
  gameState,
  onGameStateChange,
  isActive
}) => {
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<TrainingLesson | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [positionIndex, setPositionIndex] = useState(0);
  const [userRating, setUserRating] = useState(1200);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (isActive && !selectedModule) {
      // Auto-select appropriate module based on rating
      const availableModules = TRAINING_MODULES.filter(m => m.requiredRating <= userRating);
      if (availableModules.length > 0) {
        setSelectedModule(availableModules[0]);
      }
    }
  }, [isActive, userRating]);

  const startLesson = (lesson: TrainingLesson) => {
    setCurrentLesson(lesson);
    setPositionIndex(0);
    setStartTime(new Date());
    setLessonProgress(0);
    
    // Load first position
    if (lesson.positions.length > 0) {
      loadPosition(lesson.positions[0]);
    }
    
    toast.success(`Starting lesson: ${lesson.title}`, {
      description: lesson.objective
    });
  };

  const loadPosition = (fen: string) => {
    try {
      // This would integrate with your FEN loading logic
      toast.info('Position loaded', {
        description: 'Find the best move for this position'
      });
    } catch (error) {
      toast.error('Failed to load position');
    }
  };

  const checkSolution = (move: string): boolean => {
    if (!currentLesson) return false;
    
    const expectedMove = currentLesson.solution[positionIndex];
    const isCorrect = move === expectedMove;
    
    if (isCorrect) {
      setLessonProgress(prev => prev + (100 / currentLesson.solution.length));
      
      if (positionIndex + 1 >= currentLesson.solution.length) {
        completeLesson();
        return true;
      } else {
        setPositionIndex(prev => prev + 1);
        toast.success('Correct! Continue to next move...', {
          duration: 2000
        });
      }
    } else {
      toast.error('Incorrect move. Try again!', {
        description: 'Think about the lesson objective'
      });
    }
    
    return isCorrect;
  };

  const completeLesson = () => {
    if (!currentLesson || !startTime) return;
    
    const completionTime = Date.now() - startTime.getTime();
    const timeBonus = currentLesson.timeLimit ? 
      Math.max(0, Math.floor((currentLesson.timeLimit * 1000 - completionTime) / 1000)) : 0;
    
    const totalPoints = currentLesson.points + timeBonus;
    
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
    setTotalScore(prev => prev + totalPoints);
    setLessonProgress(100);
    
    toast.success('🎉 Lesson completed!', {
      description: `Earned ${totalPoints} points (${timeBonus} time bonus)`,
      duration: 4000
    });
    
    // Update user rating based on performance
    if (timeBonus > 10) {
      setUserRating(prev => prev + 10);
    }
  };

  const getModuleProgress = (module: TrainingModule): number => {
    const completed = module.lessons.filter(l => completedLessons.has(l.id)).length;
    return (completed / module.lessons.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'master': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tactics': return <Target className="w-4 h-4" />;
      case 'endgame': return <Trophy className="w-4 h-4" />;
      case 'opening': return <BookOpen className="w-4 h-4" />;
      case 'strategy': return <Brain className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (!isActive) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-7 h-7 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Professional Training</h3>
            <p className="text-sm text-gray-600">Systematic chess improvement</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Star className="w-3 h-3 mr-1" />
            Rating: {userRating}
          </Badge>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            Score: {totalScore}
          </Badge>
        </div>
      </div>

      {!selectedModule ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRAINING_MODULES.map((module) => {
            const isUnlocked = module.requiredRating <= userRating;
            const progress = getModuleProgress(module);
            
            return (
              <Card 
                key={module.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isUnlocked 
                    ? 'hover:shadow-md border-blue-200 bg-white' 
                    : 'opacity-50 bg-gray-50 cursor-not-allowed'
                }`}
                onClick={() => isUnlocked && setSelectedModule(module)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(module.category)}
                    <h4 className="font-semibold">{module.name}</h4>
                  </div>
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{module.lessons.length} lessons</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {!isUnlocked && (
                  <div className="mt-2 text-xs text-red-600">
                    Requires rating: {module.requiredRating}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : !currentLesson ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">{selectedModule.name}</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedModule(null)}
            >
              ← Back to Modules
            </Button>
          </div>
          
          <p className="text-gray-600 mb-6">{selectedModule.description}</p>
          
          <div className="grid gap-3">
            {selectedModule.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              
              return (
                <Card 
                  key={lesson.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => startLesson(lesson)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <h5 className="font-medium">{lesson.title}</h5>
                        <p className="text-sm text-gray-600">{lesson.objective}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {lesson.timeLimit && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {lesson.timeLimit}s
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {lesson.points} pts
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">{currentLesson.title}</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentLesson(null)}
            >
              ← Back to Lessons
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-100 rounded border border-blue-200">
              <p className="text-blue-800">{currentLesson.objective}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold">{Math.round(lessonProgress)}%</div>
                <div className="text-gray-600">Progress</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{positionIndex + 1}/{currentLesson.solution.length}</div>
                <div className="text-gray-600">Move</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{currentLesson.points}</div>
                <div className="text-gray-600">Points</div>
              </div>
            </div>
            
            <Progress value={lessonProgress} className="h-3" />
            
            {startTime && currentLesson.timeLimit && (
              <div className="text-center">
                <Clock className="w-4 h-4 inline mr-1" />
                Time remaining: {Math.max(0, currentLesson.timeLimit - Math.floor((Date.now() - startTime.getTime()) / 1000))}s
              </div>
            )}
            
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-sm text-gray-700">{currentLesson.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfessionalTrainingMode;
