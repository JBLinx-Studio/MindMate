import React, { useState, useCallback } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, Settings } from 'lucide-react';

interface EnhancedChessBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const EnhancedChessBoard: React.FC<EnhancedChessBoardProps> = ({ 
  gameState, 
  onGameStateChange 
}) => {
  const [draggedPiece, setDraggedPiece] = useState<{ from: Position } | null>(null);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [showAnalysisArrows, setShowAnalysisArrows] = useState(false);

  const handleSquareClick = useCallback((position: Position) => {
    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedSquare) {
      // Try to make a move
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      if (newGameState) {
        onGameStateChange(newGameState);
        
        // Check for captures
        if (piece && piece.color !== gameState.currentPlayer) {
          toast.success(`${piece.type} captured!`, {
            duration: 2000,
          });
        }
        
        // Check for check (simplified)
        const kingInCheck = false; // TODO: Implement check detection
        if (kingInCheck) {
          toast.warning('Check!', {
            duration: 3000,
          });
        }
      } else {
        // Invalid move sound/feedback
        toast.error('Invalid move!', {
          duration: 1000,
        });
        
        // Select new piece or deselect
        if (piece && piece.color === gameState.currentPlayer) {
          const validMoves = getValidMoves(piece, gameState.board, gameState);
          onGameStateChange({
            ...gameState,
            selectedSquare: position,
            validMoves
          });
        } else {
          onGameStateChange({
            ...gameState,
            selectedSquare: undefined,
            validMoves: []
          });
        }
      }
    } else if (piece && piece.color === gameState.currentPlayer) {
      // Select piece
      const validMoves = getValidMoves(piece, gameState.board, gameState);
      onGameStateChange({
        ...gameState,
        selectedSquare: position,
        validMoves
      });
    }
  }, [gameState, onGameStateChange]);

  const handleDragStart = useCallback((e: React.DragEvent, position: Position) => {
    const piece = gameState.board[position.y][position.x];
    if (piece && piece.color === gameState.currentPlayer) {
      setDraggedPiece({ from: position });
      e.dataTransfer.effectAllowed = 'move';
      
      // Add ghost image styling
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(5deg)';
      e.dataTransfer.setDragImage(dragImage, 32, 32);
    }
  }, [gameState]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, position: Position) => {
    e.preventDefault();
    
    if (draggedPiece) {
      const newGameState = makeMove(gameState, draggedPiece.from, position);
      if (newGameState) {
        onGameStateChange(newGameState);
        toast.success('Good move!', {
          duration: 1500,
        });
      }
      setDraggedPiece(null);
    }
  }, [draggedPiece, gameState, onGameStateChange]);

  const isValidMove = useCallback((position: Position): boolean => {
    return gameState.validMoves.some(move => move.x === position.x && move.y === position.y);
  }, [gameState.validMoves]);

  const isLastMove = useCallback((position: Position): boolean => {
    const lastMove = gameState.moves[gameState.moves.length - 1];
    return lastMove && (
      (lastMove.from.x === position.x && lastMove.from.y === position.y) ||
      (lastMove.to.x === position.x && lastMove.to.y === position.y)
    );
  }, [gameState.moves]);

  const displayBoard = boardFlipped ? 
    [...gameState.board].reverse().map(row => [...row].reverse()) : 
    gameState.board;

  return (
    <div className="space-y-4">
      {/* Enhanced Board Controls */}
      <div className="flex justify-center space-x-3">
        <Button
          onClick={() => setBoardFlipped(!boardFlipped)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white/80"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Flip Board
        </Button>
        <Button
          onClick={() => setShowCoordinates(!showCoordinates)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white/80"
        >
          <Eye className="w-4 h-4 mr-1" />
          {showCoordinates ? 'Hide' : 'Show'} Coords
        </Button>
        <Button
          onClick={() => setShowAnalysisArrows(!showAnalysisArrows)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white/80"
        >
          <Settings className="w-4 h-4 mr-1" />
          Analysis
        </Button>
      </div>

      {/* Premium Chess Board */}
      <div className="relative">
        <div className="inline-block border-8 border-amber-900 rounded-2xl shadow-2xl bg-gradient-to-br from-amber-100 to-amber-200 p-4">
          {/* Board Decoration */}
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl opacity-50"></div>
          
          <div className="relative grid grid-cols-8 gap-0 rounded-xl overflow-hidden shadow-inner">
            {displayBoard.map((row, y) =>
              row.map((piece, x) => {
                const actualX = boardFlipped ? 7 - x : x;
                const actualY = boardFlipped ? 7 - y : y;
                
                return (
                  <ChessSquare
                    key={`${actualX}-${actualY}`}
                    position={{ x: actualX, y: actualY }}
                    piece={piece}
                    isLight={(actualX + actualY) % 2 === 0}
                    isSelected={gameState.selectedSquare?.x === actualX && gameState.selectedSquare?.y === actualY}
                    isValidMove={isValidMove({ x: actualX, y: actualY })}
                    isLastMove={isLastMove({ x: actualX, y: actualY })}
                    onClick={() => handleSquareClick({ x: actualX, y: actualY })}
                    onDragStart={(e) => handleDragStart(e, { x: actualX, y: actualY })}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, { x: actualX, y: actualY })}
                    showCoordinates={showCoordinates}
                  />
                );
              })
            )}
          </div>
          
          {/* Enhanced Board evaluation bar */}
          <div className="mt-6 h-4 bg-gradient-to-r from-red-900 via-gray-300 to-green-900 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-1000 relative"
              style={{ width: '52%' }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-white shadow-lg"></div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-700 mt-2 font-medium">
            Position: <span className="text-green-600 font-semibold">+0.3 (White is slightly better)</span>
          </div>
        </div>

        {/* Analysis Arrows Overlay */}
        {showAnalysisArrows && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {/* Mock analysis arrows */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
              </defs>
              <line x1="25%" y1="75%" x2="35%" y2="55%" 
                    stroke="#10b981" strokeWidth="4" 
                    markerEnd="url(#arrowhead)" opacity="0.8" />
              <text x="30%" y="50%" fill="#10b981" fontSize="12" fontWeight="bold">
                Best
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Move Suggestion */}
      <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30">
        <div className="text-sm text-gray-600 mb-1">Engine Suggestion</div>
        <div className="text-lg font-bold text-blue-600">Nf3</div>
        <div className="text-xs text-gray-500">Develops knight, controls center</div>
      </div>
    </div>
  );
};

export default EnhancedChessBoard;
