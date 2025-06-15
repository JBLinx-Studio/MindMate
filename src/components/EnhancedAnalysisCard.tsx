
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Brain, Target, Clock, Zap } from 'lucide-react';
import { DetailedAnalysis } from '../utils/realChessEngine';

interface EnhancedAnalysisCardProps {
  analysis: DetailedAnalysis;
  isAnalyzing: boolean;
}

const EnhancedAnalysisCard: React.FC<EnhancedAnalysisCardProps> = ({ 
  analysis, 
  isAnalyzing 
}) => {
  const getEvaluationBar = () => {
    const normalized = Math.max(-5, Math.min(5, analysis.evaluation));
    return ((normalized + 5) / 10) * 100;
  };

  const getEvaluationText = () => {
    const abs = Math.abs(analysis.evaluation);
    if (abs < 0.5) return "Equal position";
    if (abs < 1.5) return `${analysis.evaluation > 0 ? 'White' : 'Black'} slightly better (+${abs.toFixed(1)})`;
    if (abs < 3) return `${analysis.evaluation > 0 ? 'White' : 'Black'} better (+${abs.toFixed(1)})`;
    return `${analysis.evaluation > 0 ? 'White' : 'Black'} winning (+${abs.toFixed(1)})`;
  };

  const getGamePhaseColor = () => {
    switch (analysis.gamePhase) {
      case 'opening': return 'bg-green-100 text-green-800 border-green-200';
      case 'middlegame': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'endgame': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = () => {
    if (analysis.confidence > 0.8) return 'text-green-600';
    if (analysis.confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="w-6 h-6 animate-spin text-blue-600" />
          <div className="text-lg font-medium">Analyzing position...</div>
        </div>
        <div className="mt-4">
          <Progress value={75} className="h-2" />
          <div className="text-sm text-gray-500 text-center mt-2">
            Evaluating tactical patterns and strategic elements
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Header with evaluation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Position Analysis
          </h3>
          <div className="flex items-center space-x-2">
            <Badge className={getGamePhaseColor()}>
              {analysis.gamePhase}
            </Badge>
            <Badge variant="outline" className={getConfidenceColor()}>
              {Math.round(analysis.confidence * 100)}% confidence
            </Badge>
          </div>
        </div>

        {/* Evaluation bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">White</span>
            <span className="font-mono text-lg font-bold">
              {analysis.evaluation > 0 ? '+' : ''}{analysis.evaluation.toFixed(2)}
            </span>
            <span className="font-medium">Black</span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-white to-gray-100 transition-all duration-700 ease-out"
              style={{ width: `${getEvaluationBar()}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-gray-900 to-gray-600 transition-all duration-700 ease-out"
              style={{ width: `${100 - getEvaluationBar()}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 mt-2 font-medium">
            {getEvaluationText()}
          </div>
        </div>
      </div>

      {/* Best move section */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center">
          <Target className="w-4 h-4 mr-2 text-green-600" />
          Recommended Move
        </h4>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="font-mono text-2xl font-bold text-center text-blue-900">
            {analysis.bestMove}
          </div>
        </div>
        
        {analysis.principalVariation.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Principal Variation</div>
            <div className="font-mono text-sm bg-gray-50 p-3 rounded border">
              {analysis.principalVariation.join(' ')}
            </div>
          </div>
        )}
      </div>

      {/* Engine statistics */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Depth</div>
          <div className="text-lg font-semibold text-gray-900">{analysis.depth}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Nodes</div>
          <div className="text-lg font-semibold text-gray-900">
            {analysis.nodes.toLocaleString()}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1" />
            Time
          </div>
          <div className="text-lg font-semibold text-gray-900">{analysis.time}ms</div>
        </div>
      </div>

      {/* Tactical motifs */}
      {analysis.tacticalMotifs.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-600" />
            Tactical Patterns
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.tacticalMotifs.map((motif, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {motif}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedAnalysisCard;
