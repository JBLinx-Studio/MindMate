
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, Brain, Target, AlertTriangle, Lightbulb, 
  TrendingUp, Clock, Database, BookOpen, Zap 
} from 'lucide-react';
import { GameState } from '../types/chess';
import { realChessEngine, DetailedAnalysis } from '../utils/realChessEngine';
import { gameDatabase } from '../utils/gameDatabase';

interface RealAnalysisPanelProps {
  gameState: GameState;
}

const RealAnalysisPanel: React.FC<RealAnalysisPanelProps> = ({ gameState }) => {
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(false);

  const analyzePosition = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time for realism
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = realChessEngine.analyzePosition(gameState);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (autoAnalysis && gameState.moves.length > 0) {
      analyzePosition();
    }
  }, [gameState.moves.length, autoAnalysis]);

  const getEvaluationBar = () => {
    if (!analysis) return 50;
    
    // Convert centipawn evaluation to percentage (0-100)
    const normalized = Math.max(-5, Math.min(5, analysis.evaluation));
    return ((normalized + 5) / 10) * 100;
  };

  const getEvaluationText = () => {
    if (!analysis) return "Even";
    
    const abs = Math.abs(analysis.evaluation);
    if (abs < 0.5) return "Even";
    if (abs < 1.5) return `${analysis.evaluation > 0 ? 'White' : 'Black'} slightly better`;
    if (abs < 3) return `${analysis.evaluation > 0 ? 'White' : 'Black'} better`;
    return `${analysis.evaluation > 0 ? 'White' : 'Black'} winning`;
  };

  const getGameStatistics = () => {
    const stats = gameDatabase.getGameStatistics();
    return stats;
  };

  const stats = getGameStatistics();
  const openingInfo = realChessEngine.getOpeningInfo(
    gameState.moves.map(move => move.notation)
  );

  return (
    <div className="space-y-4">
      {/* Analysis Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Analysis Engine
          </h3>
          <Badge variant={autoAnalysis ? "default" : "outline"}>
            {autoAnalysis ? "Auto" : "Manual"}
          </Badge>
        </div>
        
        <div className="space-y-3">
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
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setAutoAnalysis(!autoAnalysis)}
            >
              Auto: {autoAnalysis ? 'ON' : 'OFF'}
            </Button>
          </div>
          
          {analysis && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="text-xs text-gray-500">Depth</div>
                <div className="font-semibold">{analysis.depth}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Nodes</div>
                <div className="font-semibold">{analysis.nodes.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Time</div>
                <div className="font-semibold">{analysis.time}ms</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Position Evaluation */}
      {analysis && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
            Position Evaluation
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>White</span>
                <span className="font-mono">{analysis.evaluation > 0 ? '+' : ''}{analysis.evaluation}</span>
                <span>Black</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-white to-gray-100 transition-all duration-500"
                  style={{ width: `${getEvaluationBar()}%` }}
                />
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-black to-gray-700 transition-all duration-500"
                  style={{ width: `${100 - getEvaluationBar()}%` }}
                />
              </div>
              <div className="text-center text-sm text-gray-600 mt-1">
                {getEvaluationText()}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Best Move</div>
              <div className="font-mono text-lg bg-blue-50 p-2 rounded text-center">
                {analysis.bestMove}
              </div>
            </div>
            
            {analysis.principalVariation.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Principal Variation</div>
                <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                  {analysis.principalVariation.join(' ')}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="suggestions">Tips</TabsTrigger>
          <TabsTrigger value="opening">Opening</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-2">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
              Threats & Weaknesses
            </h4>
            
            {analysis ? (
              <div className="space-y-3">
                {analysis.threats.length > 0 ? (
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-2">Immediate Threats</div>
                    <ul className="space-y-1">
                      {analysis.threats.map((threat, index) => (
                        <li key={index} className="text-sm bg-red-50 p-2 rounded flex items-start">
                          <AlertTriangle className="w-3 h-3 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No immediate threats detected
                  </div>
                )}
                
                {analysis.weaknesses.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-orange-600 mb-2">Positional Weaknesses</div>
                    <ul className="space-y-1">
                      {analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm bg-orange-50 p-2 rounded">
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Run analysis to see threats and weaknesses
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-2">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
              Strategic Suggestions
            </h4>
            
            {analysis ? (
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm bg-yellow-50 p-3 rounded flex items-start">
                    <Lightbulb className="w-3 h-3 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Run analysis to get strategic suggestions
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="opening" className="space-y-2">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
              Opening Information
            </h4>
            
            {openingInfo ? (
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-semibold">{openingInfo.name}</div>
                  <div className="text-sm text-gray-600">ECO: {openingInfo.eco}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{openingInfo.whiteWins}%</div>
                    <div className="text-gray-500">White wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{openingInfo.draws}%</div>
                    <div className="text-gray-500">Draws</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{openingInfo.blackWins}%</div>
                    <div className="text-gray-500">Black wins</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Popularity</div>
                  <Progress value={openingInfo.popularity} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">{openingInfo.popularity}% of master games</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Theory</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {openingInfo.theory}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Play more moves to identify the opening
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-2">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Database className="w-4 h-4 mr-2 text-blue-600" />
              Game Database
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
                  <div className="text-gray-500">Total Games</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(stats.averageGameLength)}
                  </div>
                  <div className="text-gray-500">Avg. Moves</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Results Distribution</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>White wins:</span>
                    <span className="font-mono">{stats.whiteWins} ({Math.round(stats.whiteWins / stats.totalGames * 100) || 0}%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Black wins:</span>
                    <span className="font-mono">{stats.blackWins} ({Math.round(stats.blackWins / stats.totalGames * 100) || 0}%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Draws:</span>
                    <span className="font-mono">{stats.draws} ({Math.round(stats.draws / stats.totalGames * 100) || 0}%)</span>
                  </div>
                </div>
              </div>
              
              {stats.mostPlayedOpenings.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Popular Openings</div>
                  <div className="space-y-1">
                    {stats.mostPlayedOpenings.slice(0, 3).map((opening, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="truncate">{opening.opening}</span>
                        <span className="font-mono ml-2">{opening.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealAnalysisPanel;
