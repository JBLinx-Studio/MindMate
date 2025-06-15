import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Brain, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { GameState } from '../types/chess';

interface AnalysisPanelProps {
  gameState: GameState;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ gameState }) => {
  const [analysisDepth, setAnalysisDepth] = useState(20);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockAnalysis = {
    evaluation: 0.3,
    bestMove: "Nf3",
    principalVariation: ["Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6"],
    alternatives: [
      { move: "e4", eval: 0.2, description: "King's pawn opening" },
      { move: "d4", eval: 0.1, description: "Queen's pawn opening" },
      { move: "Nc3", eval: 0.0, description: "Knight development" }
    ],
    threats: ["Black can play ...Bb4+ forking king and knight"],
    opportunities: ["White has good kingside attacking chances"],
    positionType: "Open",
    gamePhase: "Opening",
    accuracy: { white: 94, black: 89 },
    mistakes: [
      { move: "Qh5?", description: "Premature queen development", player: "black" }
    ]
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const getEvaluationColor = (evaluation: number) => {
    if (evaluation > 0.5) return "text-green-600";
    if (evaluation < -0.5) return "text-red-600";
    return "text-gray-600";
  };

  const getEvaluationText = (evaluation: number) => {
    if (evaluation > 1) return "White is winning";
    if (evaluation > 0.5) return "White is better";
    if (evaluation > 0.1) return "White is slightly better";
    if (evaluation > -0.1) return "Equal position";
    if (evaluation > -0.5) return "Black is slightly better";
    if (evaluation > -1) return "Black is better";
    return "Black is winning";
  };

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Engine Analysis
          </h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Depth:</span>
              <select 
                value={analysisDepth}
                onChange={(e) => setAnalysisDepth(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
            <Button 
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Analysis Progress</span>
              <span>Depth {analysisDepth}</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}
      </Card>

      {/* Position Evaluation */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Position Evaluation
        </h4>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getEvaluationColor(mockAnalysis.evaluation)}`}>
              {mockAnalysis.evaluation > 0 ? '+' : ''}{mockAnalysis.evaluation.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {getEvaluationText(mockAnalysis.evaluation)}
            </div>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${50 + mockAnalysis.evaluation * 20}%`,
                background: mockAnalysis.evaluation > 0 ? '#22c55e' : '#ef4444'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Black Advantage</span>
            <span>Equal</span>
            <span>White Advantage</span>
          </div>
        </div>
      </Card>

      {/* Best Move */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          Best Move
        </h4>
        
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="text-2xl font-bold text-green-800 mb-2">{mockAnalysis.bestMove}</div>
          <div className="text-sm text-green-700">
            Principal Variation: {mockAnalysis.principalVariation.join(' ')}
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium text-gray-800">Alternative Moves:</h5>
          {mockAnalysis.alternatives.map((alt, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-semibold">{alt.move}</span>
                <span className="text-sm text-gray-600 ml-2">{alt.description}</span>
              </div>
              <span className={`font-semibold ${getEvaluationColor(alt.eval)}`}>
                {alt.eval > 0 ? '+' : ''}{alt.eval.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Threats & Opportunities */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
          Tactical Analysis
        </h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-red-700 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Threats
            </h5>
            <ul className="space-y-1">
              {mockAnalysis.threats.map((threat, index) => (
                <li key={index} className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                  {threat}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-green-700 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Opportunities
            </h5>
            <ul className="space-y-1">
              {mockAnalysis.opportunities.map((opportunity, index) => (
                <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Position Characteristics */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Position Characteristics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="font-semibold text-blue-800">{mockAnalysis.positionType}</div>
            <div className="text-xs text-blue-600">Position Type</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="font-semibold text-purple-800">{mockAnalysis.gamePhase}</div>
            <div className="text-xs text-purple-600">Game Phase</div>
          </div>
        </div>
      </Card>

      {/* Mistakes & Accuracy */}
      {mockAnalysis.mistakes.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Mistakes Analysis
          </h4>
          
          <div className="space-y-3">
            {mockAnalysis.mistakes.map((mistake, index) => (
              <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                <div className="font-semibold text-red-800">{mistake.move}</div>
                <div className="text-sm text-red-700 mt-1">{mistake.description}</div>
                <div className="text-xs text-red-600 mt-1 capitalize">
                  Played by {mistake.player}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalysisPanel;
