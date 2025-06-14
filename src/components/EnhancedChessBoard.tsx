
import React, { useState, useCallback } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';
import GameResultModal from './GameResultModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, Settings, Crown, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
  const [showResultModal, setShowResultModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSquareClick = useCallback((position: Position) => {
    if (gameState.isGameOver) {
      if (!showResultModal) {
        setShowResultModal(true);
      }
      return;
    }

    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedSquare) {
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      if (newGameState) {
        onGameStateChange(newGameState);
        
        if (piece && piece.color !== gameState.currentPlayer) {
          toast.success(`${piece.type} captured!`, {
            duration: 2000,
          });
        }
        
        if (newGameState.isGameOver) {
          setTimeout(() => setShowResultModal(true), 1000);
        } else if (isInCheck(newGameState.board, newGameState.currentPlayer)) {
          toast.warning('Check!', { duration: 3000 });
        }
      } else {
        toast.error('Invalid move!', { duration: 1000 });
        
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
      const validMoves = getValidMoves(piece, gameState.board, gameState);
      onGameStateChange({
        ...gameState,
        selectedSquare: position,
        validMoves
      });
    }
  }, [gameState, onGameStateChange, showResultModal]);

  const handleDragStart = useCallback((e: React.DragEvent, position: Position) => {
    if (gameState.isGameOver) {
      e.preventDefault();
      return;
    }

    const piece = gameState.board[position.y][position.x];
    if (piece && piece.color === gameState.currentPlayer) {
      setDraggedPiece({ from: position });
      e.dataTransfer.effectAllowed = 'move';
      
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(5deg) scale(1.1)';
      e.dataTransfer.setDragImage(dragImage, 32, 32);
    }
  }, [gameState]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, position: Position) => {
    e.preventDefault();
    
    if (draggedPiece && !gameState.isGameOver) {
      const newGameState = makeMove(gameState, draggedPiece.from, position);
      if (newGameState) {
        onGameStateChange(newGameState);
        toast.success('Nice move!', { duration: 1500 });
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

  const handleNewGame = () => {
    setShowResultModal(false);
  };

  const currentPlayerInCheck = isInCheck(gameState.board, gameState.currentPlayer);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Board Controls */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => setBoardFlipped(!boardFlipped)}
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setShowCoordinates(!showCoordinates)}
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentPlayerInCheck && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Check!
            </Badge>
          )}
          
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="ghost"
            size="sm"
            className="text-gray-600"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Chess Board Container */}
      <div className="relative">
        <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-6 rounded-2xl shadow-2xl border-4 border-amber-800/20">
          {/* Board Background Pattern */}
          <div className="absolute inset-0 opacity-5 rounded-2xl" 
               style={{
                 backgroundImage: `url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23d4a574" fill-opacity="0.4"%3E%3Cpath d="M0 0h20v20H0V0zm20 20h20v20H20V20z"/%3E%3C/g%3E%3C/svg%3E')`
               }} />
          
          {/* Chess Board Grid */}
          <div className="relative grid grid-cols-8 gap-0 rounded-xl overflow-hidden shadow-inner bg-white/10 backdrop-blur-sm border border-white/20">
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
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-3 border-t-3 border-amber-700/40 rounded-tl-lg"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-r-3 border-t-3 border-amber-700/40 rounded-tr-lg"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-3 border-b-3 border-amber-700/40 rounded-bl-lg"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-3 border-b-3 border-amber-700/40 rounded-br-lg"></div>
        </div>

        {/* Position Evaluation Bar */}
        <Card className="mt-4 p-3 bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Position Evaluation</span>
            <Badge variant="outline" className="text-xs">Engine</Badge>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-black via-gray-500 to-white transition-all duration-1000"
              style={{ width: '52%' }}
            />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-yellow-400 shadow-sm"></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Black</span>
            <span className="font-mono font-medium">+0.3</span>
            <span>White</span>
          </div>
        </Card>
      </div>

      {/* Game Result Modal */}
      {showResultModal && gameState.isGameOver && (
        <GameResultModal
          gameState={gameState}
          onNewGame={handleNewGame}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
};

export default EnhancedChessBoard;
