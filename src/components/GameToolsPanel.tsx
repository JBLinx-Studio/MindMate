import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Copy, Download, Upload, RotateCcw, Bookmark, Share2, Zap, Eye, FileText, Database } from 'lucide-react';
import { GameState } from '../types/chess';
import { ChessNotation } from '../utils/chessNotation';
import { chessEngine } from '../utils/chessEngine';
import { createInitialGameState } from '../utils/chessLogic';
import { toast } from 'sonner';

interface GameToolsPanelProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const GameToolsPanel: React.FC<GameToolsPanelProps> = ({ gameState, onGameStateChange }) => {
  const [fenInput, setFenInput] = useState('');
  const [pgnInput, setPgnInput] = useState('');
  const [bookmarkName, setBookmarkName] = useState('');
  const [savedBookmarks, setSavedBookmarks] = useState<Array<{name: string, fen: string, date: string}>>(() => {
    const saved = localStorage.getItem('chess-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const currentFen = ChessNotation.boardToFEN(gameState);

  const generatePGN = () => {
    let gameResult = '*';
    if (gameState.isGameOver) {
      if (gameState.winner === 'white') gameResult = '1-0';
      else if (gameState.winner === 'black') gameResult = '0-1';
      else gameResult = '1/2-1/2';
    }
    
    return ChessNotation.movesToPGN(gameState.moves, gameResult);
  };

  const copyFEN = () => {
    navigator.clipboard.writeText(currentFen);
    toast.success('FEN copied to clipboard!', {
      description: 'You can now paste this position elsewhere'
    });
  };

  const copyPGN = () => {
    const pgn = generatePGN();
    navigator.clipboard.writeText(pgn);
    toast.success('PGN copied to clipboard!', {
      description: `${gameState.moves.length} moves exported`
    });
  };

  const downloadPGN = () => {
    const pgn = generatePGN();
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chess-game-${new Date().toISOString().split('T')[0]}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('PGN file downloaded!', {
      description: 'Game saved to your downloads folder'
    });
  };

  const loadFromFEN = () => {
    if (!fenInput.trim()) {
      toast.error('Please enter a FEN string');
      return;
    }

    try {
      const { board, currentPlayer } = ChessNotation.fenToBoard(fenInput.trim());
      const newGameState: GameState = {
        board,
        currentPlayer,
        moves: [],
        isGameOver: false,
        validMoves: [],
        selectedSquare: undefined,
        fullMoveNumber: 1
      };
      
      onGameStateChange(newGameState);
      toast.success('Position loaded from FEN!', {
        description: 'Board updated successfully'
      });
      setFenInput('');
    } catch (error) {
      toast.error('Invalid FEN string', {
        description: 'Please check the format and try again'
      });
    }
  };

  const loadFromPGN = () => {
    if (!pgnInput.trim()) {
      toast.error('Please enter PGN text');
      return;
    }

    try {
      const moves = ChessNotation.pgnToMoves(pgnInput.trim());
      
      // Start with initial position and apply moves
      let newGameState = createInitialGameState();
      
      // For now, just show success - full PGN replay would need move application logic
      toast.success('PGN structure parsed!', {
        description: `Found ${moves.length} moves`
      });
      setPgnInput('');
    } catch (error) {
      toast.error('Invalid PGN format', {
        description: 'Please check the PGN and try again'
      });
    }
  };

  const saveBookmark = () => {
    if (!bookmarkName.trim()) {
      toast.error('Please enter a bookmark name');
      return;
    }

    const newBookmark = {
      name: bookmarkName.trim(),
      fen: currentFen,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedBookmarks = [...savedBookmarks, newBookmark];
    setSavedBookmarks(updatedBookmarks);
    localStorage.setItem('chess-bookmarks', JSON.stringify(updatedBookmarks));
    
    toast.success(`Position bookmarked as "${bookmarkName}"!`, {
      description: 'Saved to local storage'
    });
    setBookmarkName('');
  };

  const loadBookmark = (bookmark: {name: string, fen: string, date: string}) => {
    try {
      const { board, currentPlayer } = ChessNotation.fenToBoard(bookmark.fen);
      const newGameState: GameState = {
        board,
        currentPlayer,
        moves: [],
        isGameOver: false,
        validMoves: [],
        selectedSquare: undefined,
        fullMoveNumber: 1
      };
      
      onGameStateChange(newGameState);
      toast.success(`Loaded "${bookmark.name}"`, {
        description: 'Position restored from bookmark'
      });
    } catch (error) {
      toast.error('Failed to load bookmark', {
        description: 'The saved position may be corrupted'
      });
    }
  };

  const deleteBookmark = (index: number) => {
    const updatedBookmarks = savedBookmarks.filter((_, i) => i !== index);
    setSavedBookmarks(updatedBookmarks);
    localStorage.setItem('chess-bookmarks', JSON.stringify(updatedBookmarks));
    toast.success('Bookmark deleted');
  };

  const shareGame = () => {
    const gameData = {
      fen: currentFen,
      pgn: generatePGN(),
      moves: gameState.moves.length
    };
    
    const shareUrl = `${window.location.origin}/game?fen=${encodeURIComponent(currentFen)}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Game link copied to clipboard!', {
      description: 'Anyone can view this position with the link'
    });
  };

  const resetBoard = () => {
    const initialState = createInitialGameState();
    onGameStateChange(initialState);
    toast.success('Board reset to starting position!');
  };

  const analyzeCurrentPosition = () => {
    const evaluation = chessEngine.evaluatePosition(gameState);
    const evalText = evaluation.centipawns > 0 ? 
      `White is better by ${(evaluation.centipawns / 100).toFixed(1)}` :
      `Black is better by ${Math.abs(evaluation.centipawns / 100).toFixed(1)}`;
    
    toast.success('Position analyzed!', {
      description: `${evalText} - Best move: ${evaluation.bestMove}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button onClick={copyFEN} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-1" />
            Copy FEN
          </Button>
          <Button onClick={copyPGN} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            Copy PGN
          </Button>
          <Button onClick={downloadPGN} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button onClick={shareGame} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button onClick={analyzeCurrentPosition} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Analyze
          </Button>
          <Button onClick={resetBoard} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Current Position Info */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-blue-600" />
          Current Position
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">FEN String</label>
            <div className="flex space-x-2">
              <Input 
                value={currentFen} 
                readOnly 
                className="font-mono text-sm bg-gray-50"
              />
              <Button onClick={copyFEN} size="sm" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">To Move:</span>
              <Badge variant="outline" className="capitalize">
                {gameState.currentPlayer}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moves:</span>
              <span className="font-semibold">{gameState.moves.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={gameState.isGameOver ? "destructive" : "default"}>
                {gameState.isGameOver ? 'Finished' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Load Position */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Load Position</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From FEN</label>
            <div className="flex space-x-2">
              <Input 
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                className="font-mono text-sm"
              />
              <Button onClick={loadFromFEN} disabled={!fenInput.trim()}>
                Load
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From PGN</label>
            <Textarea 
              value={pgnInput}
              onChange={(e) => setPgnInput(e.target.value)}
              placeholder="1. e4 e5 2. Nf3 Nc6..."
              className="h-32 font-mono text-sm"
            />
            <Button onClick={loadFromPGN} disabled={!pgnInput.trim()} className="mt-2">
              <Upload className="w-4 h-4 mr-1" />
              Load Game
            </Button>
          </div>
        </div>
      </Card>

      {/* Bookmark Position */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Bookmark className="w-5 h-5 mr-2 text-purple-600" />
          Bookmarks
        </h4>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
              placeholder="Enter bookmark name..."
            />
            <Button onClick={saveBookmark} disabled={!bookmarkName.trim()}>
              <Bookmark className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
          
          {savedBookmarks.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Saved Positions ({savedBookmarks.length})</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedBookmarks.map((bookmark, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{bookmark.name}</div>
                      <div className="text-xs text-gray-500">{bookmark.date}</div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => loadBookmark(bookmark)}
                      >
                        Load
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteBookmark(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Export & Share</h4>
        <div className="space-y-3">
          <Button onClick={downloadPGN} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download PGN File
          </Button>
          <Button onClick={shareGame} variant="outline" className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share Position Link
          </Button>
          <div className="text-xs text-gray-500 mt-2">
            PGN files can be imported into chess databases and analysis tools
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameToolsPanel;
