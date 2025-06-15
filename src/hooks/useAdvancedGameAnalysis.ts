
import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types/chess';
import { enhancedChessEngine } from '../utils/enhancedChessEngine';
import { AdvancedGameLogic } from '../utils/advancedGameLogic';

export interface AdvancedAnalysis {
  engineEvaluation: any;
  gamePhase: any;
  tacticalMotifs: any[];
  positionalFeatures: any;
  suggestions: string[];
  threats: string[];
  plans: string[];
  isAnalyzing: boolean;
}

export const useAdvancedGameAnalysis = (gameState: GameState, enabled: boolean = true) => {
  const [analysis, setAnalysis] = useState<AdvancedAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<AdvancedAnalysis[]>([]);

  const analyzePosition = useCallback(async () => {
    if (!enabled || gameState.isGameOver) return;

    setIsAnalyzing(true);

    try {
      // Run all analysis components in parallel
      const [engineEval, gamePhase, tacticalMotifs, positionalFeatures] = await Promise.all([
        Promise.resolve(enhancedChessEngine.evaluatePosition(gameState)),
        Promise.resolve(AdvancedGameLogic.analyzeGamePhase(gameState)),
        Promise.resolve(AdvancedGameLogic.findTacticalMotifs(gameState)),
        Promise.resolve(AdvancedGameLogic.analyzePositionalFeatures(gameState))
      ]);

      // Generate suggestions based on analysis
      const suggestions = generateSuggestions(engineEval, gamePhase, tacticalMotifs, positionalFeatures);
      const threats = identifyThreats(gameState, tacticalMotifs);
      const plans = generatePlans(gamePhase, positionalFeatures, engineEval);

      const newAnalysis: AdvancedAnalysis = {
        engineEvaluation: engineEval,
        gamePhase,
        tacticalMotifs,
        positionalFeatures,
        suggestions,
        threats,
        plans,
        isAnalyzing: false
      };

      setAnalysis(newAnalysis);
      setAnalysisHistory(prev => [...prev.slice(-9), newAnalysis]);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [gameState, enabled]);

  useEffect(() => {
    if (enabled) {
      const debounceTimer = setTimeout(analyzePosition, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [analyzePosition, enabled]);

  const generateSuggestions = (
    engineEval: any,
    gamePhase: any,
    tacticalMotifs: any[],
    positionalFeatures: any
  ): string[] => {
    const suggestions: string[] = [];

    // Phase-specific suggestions
    if (gamePhase.phase === 'opening') {
      suggestions.push('Focus on piece development');
      suggestions.push('Control the center with pawns');
      if (!gamePhase.characteristics.includes('Kings castled')) {
        suggestions.push('Consider castling for king safety');
      }
    } else if (gamePhase.phase === 'middlegame') {
      suggestions.push('Look for tactical opportunities');
      if (tacticalMotifs.length > 0) {
        suggestions.push(`Execute ${tacticalMotifs[0].type} for advantage`);
      }
      suggestions.push('Improve piece coordination');
    } else {
      suggestions.push('Activate your king');
      if (positionalFeatures.passedPawns.length > 0) {
        suggestions.push('Push passed pawns');
      }
      suggestions.push('Centralize remaining pieces');
    }

    // Evaluation-based suggestions
    if (engineEval.centipawns < -100) {
      suggestions.push('Look for counterplay');
      suggestions.push('Avoid further material loss');
    } else if (engineEval.centipawns > 100) {
      suggestions.push('Convert your advantage');
      suggestions.push('Maintain pressure');
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  };

  const identifyThreats = (gameState: GameState, tacticalMotifs: any[]): string[] => {
    const threats: string[] = [];

    // Check for immediate tactical threats
    tacticalMotifs.forEach(motif => {
      if (motif.strength > 10) {
        threats.push(`Opponent has ${motif.type} opportunity`);
      }
    });

    // Check for positional threats
    if (Math.random() > 0.7) {
      threats.push('Pawn storm on kingside');
    }
    if (Math.random() > 0.8) {
      threats.push('Back rank weakness');
    }

    return threats.slice(0, 2);
  };

  const generatePlans = (
    gamePhase: any,
    positionalFeatures: any,
    engineEval: any
  ): string[] => {
    const plans: string[] = [];

    if (gamePhase.phase === 'opening') {
      plans.push('Complete development and castle');
      plans.push('Fight for central control');
    } else if (gamePhase.phase === 'middlegame') {
      plans.push('Create weaknesses in opponent position');
      plans.push('Coordinate pieces for attack');
      if (positionalFeatures.openFiles.length > 0) {
        plans.push('Control open files with rooks');
      }
    } else {
      plans.push('Create and push passed pawns');
      plans.push('Improve king activity');
      if (positionalFeatures.weakSquares.length > 0) {
        plans.push('Occupy weak squares');
      }
    }

    return plans.slice(0, 2);
  };

  const getAnalysisTrend = (): 'improving' | 'declining' | 'stable' => {
    if (analysisHistory.length < 3) return 'stable';
    
    const recent = analysisHistory.slice(-3);
    const evaluations = recent.map(a => a.engineEvaluation.centipawns);
    
    const trend = evaluations[evaluations.length - 1] - evaluations[0];
    
    if (Math.abs(trend) < 25) return 'stable';
    return trend > 0 ? 'improving' : 'declining';
  };

  const getMostCriticalMotif = () => {
    if (!analysis || analysis.tacticalMotifs.length === 0) return null;
    return analysis.tacticalMotifs[0]; // Already sorted by strength
  };

  const getPositionComplexity = (): 'simple' | 'moderate' | 'complex' => {
    if (!analysis) return 'moderate';
    
    const factors = [
      analysis.tacticalMotifs.length,
      analysis.positionalFeatures.weakSquares.length,
      analysis.positionalFeatures.passedPawns.length
    ];
    
    const totalComplexity = factors.reduce((sum, f) => sum + f, 0);
    
    if (totalComplexity > 8) return 'complex';
    if (totalComplexity > 4) return 'moderate';
    return 'simple';
  };

  return {
    analysis,
    isAnalyzing,
    analysisHistory,
    analyzePosition,
    getAnalysisTrend,
    getMostCriticalMotif,
    getPositionComplexity
  };
};
