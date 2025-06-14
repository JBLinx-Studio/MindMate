
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Activity, TrendingUp, Target, Brain, Zap, BookOpen } from 'lucide-react';
import { GameState } from '../types/chess';
import { chessEngine, EngineEvaluation, OpeningMove } from '../utils/chessEngine';
import { ChessNotation } from '../utils/chessNotation';
import { toast } from 'sonner';

interface PositionAnalyzerProps {
  gameState?: GameState;
}

const PositionAnalyzer: React.FC<PositionAnalyzerProps> = ({ gameState }) => {
  const [fen, setFen] = useState('');
  const [analysis, setAnalysis] = useState<EngineEvaluation | null>(null);
  const [openingMoves, setOpeningMoves] = useState<OpeningMove[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const analyzePosition = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Simulate progressive analysis
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 200);

      // Use provided game state or parse FEN
      let targetGameState = gameState;
      
      if (fen.trim()) {
        try {
          const { board, currentPlayer } = ChessNotation.fenToBoard(fen);
          targetGameState = {
            board,
            currentPlayer,
            moves: [],
            isGameOver: false,
            validMoves: []
          };
        } catch (error) {
          toast.error('Invalid FEN string');
          setIsAnalyzing(false);
          clearInterval(progressInterval);
          return;
        }
      }

      if (!targetGameState) {
        toast.error('No position to analyze');
        setIsAnalyzing(false);
        clearInterval(progressInterval);
        return;
      }

      // Perform real analysis
      const engineAnalysis = chessEngine.evaluatePosition(targetGameState);
      
      // Get opening moves if early in game
      const currentFen = ChessNotation.boardToFEN(targetGameState);
      const openingData = chessEngine.getOpeningMoves('starting');
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setTimeout(() => {
        setAnalysis(engineAnalysis);
        setOpeningMoves(openingData);
        setIsAnalyzing(false);
        setAnalysisProgress(0);
        
        toast.success('Analysis complete!', {
          description: `Evaluation: ${engineAnalysis.centipawns > 0 ? '+' : ''}${(engineAnalysis.centipawns / 100).toFixed(2)}`
        });
      }, 500);
      
    } catch (error) {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      toast.error('Analysis failed', {
        description: 'Please try again or check your position'
      });
    }
  };

  const getEvaluationColor = (centipawns: number) => {
    if (centipawns > 100) return 'text-green-600';
    if (centipawns < -100) return 'text-red-600';
    return 'text-gray-600';
  };

  const getEvaluationText = (centipawns: number) => {
    const pawns = centipawns / 100;
    if (Math.abs(pawns) < 0.5) return 'Equal position';
    if (pawns > 0) return `White is better by ${pawns.toFixed(1)} pawns`;
    return `Black is better by ${Math.abs(pawns).toFixed(1)} pawns`;
  };

  return (
    <div className="space-y-6">
      {/* Analysis Input */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Position Analysis
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              FEN Position (leave empty to analyze current position)
            </label>
            <Textarea
              value={fen}
              onChange={(e) => setFen(e.target.value)}
              placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              className="h-20 font-mono text-sm"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={analyzePosition} 
              disabled={isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Position
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                if (gameState) {
                  const currentFen = ChessNotation.boardToFEN(gameState);
                  setFen(currentFen);
                  toast.success('Current position loaded');
                }
              }}
              disabled={!gameState}
            >
              Load Current
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Engine Analysis Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="text-xs text-gray-500">
                Calculating moves, evaluating position...
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Engine Evaluation
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className={`text-2xl font-bold ${getEvaluationColor(analysis.centipawns)}`}>
                {analysis.centipawns > 0 ? '+' : ''}{(analysis.centipawns / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Evaluation (pawns)</div>
              <div className="text-xs text-gray-500 mt-1">
                {getEvaluationText(analysis.centipawns)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{analysis.bestMove}</div>
              <div className="text-sm text-gray-600">Best Move</div>
              <div className="text-xs text-gray-500 mt-1">
                Engine recommendation
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{analysis.depth}</div>
              <div className="text-sm text-gray-600">Search Depth</div>
              <div className="text-xs text-gray-500 mt-1">
                {analysis.nodes.toLocaleString()} nodes
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">Principal Variation</h5>
              <div className="text-sm font-mono bg-white p-2 rounded border">
                {analysis.principalVariation.join(' ')}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Analysis Time:</span>
                <span className="font-semibold">{analysis.time}ms</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Nodes/Second:</span>
                <span className="font-semibold">{Math.round(analysis.nodes / Math.max(analysis.time, 1) * 1000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Opening Book */}
      {openingMoves.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
            Opening Book
          </h4>
          
          <div className="space-y-3">
            {openingMoves.map((opening, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg">{opening.move}</span>
                    <span className="text-sm text-gray-600">{opening.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {opening.frequency}% played
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    Results: {opening.whiteWins}% White, {opening.blackWins}% Black, {opening.draws}% Draws
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${opening.frequency}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Analysis Actions */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
          Quick Analysis
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')}
          >
            Starting Position
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFen('rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 4 4')}
          >
            Italian Game
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFen('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3')}
          >
            Spanish Opening
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFen('8/8/8/8/8/8/8/4K3 w - - 0 1')}
          >
            Endgame Study
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PositionAnalyzer;
