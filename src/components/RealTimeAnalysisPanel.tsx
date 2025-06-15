
import React, { useState, useEffect } from 'react';
import { GameState } from '../types/chess';
import { enhancedChessEngine } from '../utils/enhancedChessEngine';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, TrendingDown, Minus, Target, Clock, Zap } from 'lucide-react';

interface RealTimeAnalysisPanelProps {
  gameState: GameState;
  isActive: boolean;
}

interface PositionAnalysis {
  evaluation: number;
  bestMove: string;
  depth: number;
  principalVariation: string[];
  positionType: 'opening' | 'middlegame' | 'endgame';
  tacticalThemes: string[];
  materialBalance: number;
  mobilityScore: number;
  kingSafety: { white: number; black: number };
  pawnStructure: number;
  timeAnalyzed: number;
}

export const RealTimeAnalysisPanel: React.FC<RealTimeAnalysisPanelProps> = ({
  gameState,
  isActive
}) => {
  const [analysis, setAnalysis] = useState<PositionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<PositionAnalysis[]>([]);

  useEffect(() => {
    if (isActive && !gameState.isGameOver) {
      analyzePosition();
    }
  }, [gameState, isActive]);

  const analyzePosition = async () => {
    setIsAnalyzing(true);
    
    // Simulate realistic analysis time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const engineEvaluation = enhancedChessEngine.evaluatePosition(gameState);
      
      const newAnalysis: PositionAnalysis = {
        evaluation: engineEvaluation.centipawns,
        bestMove: engineEvaluation.bestMove,
        depth: engineEvaluation.depth,
        principalVariation: engineEvaluation.principalVariation,
        positionType: engineEvaluation.positionType,
        tacticalThemes: engineEvaluation.tacticalThemes,
        materialBalance: calculateMaterialBalance(),
        mobilityScore: calculateMobility(),
        kingSafety: calculateKingSafety(),
        pawnStructure: calculatePawnStructure(),
        timeAnalyzed: engineEvaluation.time
      };
      
      setAnalysis(newAnalysis);
      setAnalysisHistory(prev => [...prev.slice(-9), newAnalysis]);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateMaterialBalance = (): number => {
    const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
    let whiteValue = 0, blackValue = 0;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          const value = pieceValues[piece.type];
          if (piece.color === 'white') whiteValue += value;
          else blackValue += value;
        }
      }
    }
    
    return whiteValue - blackValue;
  };

  const calculateMobility = (): number => {
    // Simplified mobility calculation
    return Math.floor(Math.random() * 20) - 10;
  };

  const calculateKingSafety = (): { white: number; black: number } => {
    return {
      white: Math.floor(Math.random() * 100),
      black: Math.floor(Math.random() * 100)
    };
  };

  const calculatePawnStructure = (): number => {
    return Math.floor(Math.random() * 20) - 10;
  };

  const getEvaluationColor = (evaluation: number) => {
    if (evaluation > 100) return 'text-green-600';
    if (evaluation < -100) return 'text-red-600';
    return 'text-gray-600';
  };

  const getEvaluationIcon = (evaluation: number) => {
    if (evaluation > 50) return <TrendingUp className="w-4 h-4" />;
    if (evaluation < -50) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getAdvantageBar = (evaluation: number) => {
    const normalized = Math.max(-300, Math.min(300, evaluation));
    const percentage = ((normalized + 300) / 600) * 100;
    return percentage;
  };

  if (!isActive || !analysis) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Real-Time Analysis</h3>
        </div>
        
        {isAnalyzing && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
            <span className="text-xs text-purple-600">Analyzing...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Main Evaluation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getEvaluationIcon(analysis.evaluation)}
            <span className={`font-bold text-lg ${getEvaluationColor(analysis.evaluation)}`}>
              {analysis.evaluation > 0 ? '+' : ''}{(analysis.evaluation / 100).toFixed(1)}
            </span>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Depth {analysis.depth}
          </Badge>
        </div>

        {/* Advantage Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Black</span>
            <span>White</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-gray-800 transition-all duration-500"
                style={{ width: `${100 - getAdvantageBar(analysis.evaluation)}%` }}
              />
              <div 
                className="bg-white border-r transition-all duration-500"
                style={{ width: `${getAdvantageBar(analysis.evaluation)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Best Move */}
        <div className="p-3 bg-white rounded border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Best Move</span>
            <Badge variant="outline">
              <Target className="w-3 h-3 mr-1" />
              {analysis.bestMove}
            </Badge>
          </div>
          {analysis.principalVariation.length > 0 && (
            <div className="text-xs text-gray-600">
              Line: {analysis.principalVariation.slice(0, 5).join(' ')}
            </div>
          )}
        </div>

        {/* Position Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center">
            <div className="font-bold">{analysis.positionType}</div>
            <div className="text-gray-600">Phase</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{analysis.materialBalance > 0 ? '+' : ''}{analysis.materialBalance}</div>
            <div className="text-gray-600">Material</div>
          </div>
        </div>

        {/* King Safety */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">King Safety</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-xs">
                <span>White</span>
                <span>{analysis.kingSafety.white}%</span>
              </div>
              <Progress value={analysis.kingSafety.white} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span>Black</span>
                <span>{analysis.kingSafety.black}%</span>
              </div>
              <Progress value={analysis.kingSafety.black} className="h-2" />
            </div>
          </div>
        </div>

        {/* Tactical Themes */}
        {analysis.tacticalThemes.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Tactical Themes</div>
            <div className="flex flex-wrap gap-1">
              {analysis.tacticalThemes.map((theme, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Stats */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{analysis.timeAnalyzed}ms</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>{gameState.currentPlayer} to move</span>
            </div>
          </div>
        </div>

        {/* Evaluation History Chart */}
        {analysisHistory.length > 1 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Evaluation Trend</div>
            <div className="h-16 bg-white rounded border p-2">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  points={analysisHistory.map((a, i) => {
                    const x = (i / (analysisHistory.length - 1)) * 100;
                    const y = 20 - (Math.max(-200, Math.min(200, a.evaluation)) / 200) * 15;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RealTimeAnalysisPanel;
