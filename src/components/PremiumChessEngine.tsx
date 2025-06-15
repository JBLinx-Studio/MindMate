import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, TrendingUp, Clock, Settings } from 'lucide-react';
import { GameState } from '../types/chess';

interface PremiumChessEngineProps {
  gameState: GameState;
}

const PremiumChessEngine: React.FC<PremiumChessEngineProps> = ({ gameState }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [engineStrength, setEngineStrength] = useState(20);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [multiPV, setMultiPV] = useState(3);

  const engineAnalysis = {
    bestMove: { move: 'Nf3', evaluation: 0.32, depth: 22 },
    alternativeMoves: [
      { move: 'e4', evaluation: 0.28, depth: 20, line: ['e4', 'e5', 'Nf3', 'Nc6'] },
      { move: 'd4', evaluation: 0.24, depth: 19, line: ['d4', 'd5', 'c4', 'e6'] },
      { move: 'Nc3', evaluation: 0.18, depth: 18, line: ['Nc3', 'Nf6', 'e4', 'e5'] }
    ],
    principalVariation: ['Nf3', 'Nf6', 'c4', 'e6', 'g3', 'Be7', 'Bg2', 'O-O'],
    positionFeatures: {
      kingSafety: { white: 85, black: 78 },
      pieceActivity: { white: 72, black: 68 },
      pawnStructure: { white: 81, black: 79 },
      centerControl: { white: 67, black: 71 }
    },
    threats: [
      'Black can play ...d5 challenging the center',
      'White has potential kingside initiative'
    ],
    strategicThemes: ['Central Control', 'Piece Development', 'King Safety']
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getEvaluationColor = (evaluation: number) => {
    if (evaluation > 0.5) return 'text-green-600';
    if (evaluation < -0.5) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Engine Control Panel */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            ChessMaster AI Engine
          </h3>
          <Badge className="bg-purple-600 text-white">
            <Zap className="w-3 h-3 mr-1" />
            Pro Version
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="font-bold text-lg text-purple-700">Depth {engineStrength}</div>
            <div className="text-xs text-gray-600">Engine Strength</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="font-bold text-lg text-blue-700">{multiPV} Lines</div>
            <div className="text-xs text-gray-600">Multi-PV Analysis</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="font-bold text-lg text-green-700">2.5M nps</div>
            <div className="text-xs text-gray-600">Nodes/Second</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Deep Analysis'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Engine Settings
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Strength:</span>
            <select 
              value={engineStrength}
              onChange={(e) => setEngineStrength(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={15}>Beginner (15)</option>
              <option value={18}>Amateur (18)</option>
              <option value={20}>Expert (20)</option>
              <option value={25}>Master (25)</option>
              <option value={30}>Grandmaster (30)</option>
            </select>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Deep Analysis Progress</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-3" />
          </div>
        )}
      </Card>

      {/* Best Move Analysis */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-600" />
          Engine Recommendation
        </h4>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-bold text-green-800">
              {engineAnalysis.bestMove.move}
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${getEvaluationColor(engineAnalysis.bestMove.evaluation)}`}>
                +{engineAnalysis.bestMove.evaluation.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Depth {engineAnalysis.bestMove.depth}</div>
            </div>
          </div>
          <div className="text-sm text-gray-700">
            <strong>Principal Variation:</strong> {engineAnalysis.principalVariation.join(' ')}
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-gray-800">Alternative Moves:</h5>
          {engineAnalysis.alternativeMoves.map((move, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border-l-4 border-blue-400">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg">{move.move}</span>
                  <span className="text-sm text-gray-600">
                    Line: {move.line.join(' ')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${getEvaluationColor(move.evaluation)}`}>
                  {move.evaluation > 0 ? '+' : ''}{move.evaluation.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">d{move.depth}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Position Features */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
          Position Analysis
        </h4>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(engineAnalysis.positionFeatures).map(([feature, scores]) => (
            <div key={feature} className="space-y-2">
              <h5 className="font-medium text-sm capitalize text-gray-700">
                {feature.replace(/([A-Z])/g, ' $1')}
              </h5>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>White: {scores.white}%</span>
                  <span>Black: {scores.black}%</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <Progress value={scores.white} className="h-2" />
                  <Progress value={scores.black} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Strategic Themes:</h5>
            <div className="flex flex-wrap gap-2">
              {engineAnalysis.strategicThemes.map((theme, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-800 mb-2">Key Threats & Ideas:</h5>
            <ul className="space-y-1">
              {engineAnalysis.threats.map((threat, index) => (
                <li key={index} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
                  {threat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Engine Performance */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Engine Performance
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="font-bold text-blue-800">2.5M</div>
            <div className="text-xs text-blue-600">Nodes/sec</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="font-bold text-green-800">450M</div>
            <div className="text-xs text-green-600">Total Nodes</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="font-bold text-purple-800">3.2s</div>
            <div className="text-xs text-purple-600">Time Used</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PremiumChessEngine;
