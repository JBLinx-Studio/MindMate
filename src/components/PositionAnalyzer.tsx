
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Activity, TrendingUp, Target } from 'lucide-react';

const PositionAnalyzer: React.FC = () => {
  const [fen, setFen] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePosition = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis (in a real app, this would call a chess engine)
    setTimeout(() => {
      setAnalysis({
        evaluation: '+0.8',
        bestMove: 'Nf3',
        depth: 15,
        principalVariation: ['Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4'],
        materialBalance: {
          white: 39,
          black: 39
        },
        pieceActivity: {
          white: 'Good piece coordination',
          black: 'Slightly passive setup'
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
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
              className="h-20"
            />
          </div>
          
          <Button 
            onClick={analyzePosition} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart className="w-4 h-4 mr-2" />
                Analyze Position
              </>
            )}
          </Button>
        </div>
      </Card>

      {analysis && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Analysis Results
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-600">Evaluation</div>
                <div className="text-xl font-bold text-green-600">{analysis.evaluation}</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-600">Best Move</div>
                <div className="text-lg font-semibold">{analysis.bestMove}</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-600">Depth</div>
                <div className="text-lg font-semibold">{analysis.depth}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-600">Principal Variation</div>
                <div className="text-sm">{analysis.principalVariation.join(' ')}</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-600">Material</div>
                <div className="text-sm">
                  White: {analysis.materialBalance.white} | Black: {analysis.materialBalance.black}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PositionAnalyzer;
