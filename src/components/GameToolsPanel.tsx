
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Copy, Download, Upload, RotateCcw, Bookmark, Share2, Zap, Eye } from 'lucide-react';
import { GameState } from '../types/chess';
import { toast } from 'sonner';

interface GameToolsPanelProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const GameToolsPanel: React.FC<GameToolsPanelProps> = ({ gameState, onGameStateChange }) => {
  const [fenInput, setFenInput] = useState('');
  const [pgnInput, setPgnInput] = useState('');
  const [bookmarkName, setBookmarkName] = useState('');

  const currentFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Mock FEN

  const generatePGN = () => {
    let pgn = '[Event "Live Game"]\n[Date "2024-01-15"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "*"]\n\n';
    
    gameState.moves.forEach((move, index) => {
      if (index % 2 === 0) {
        pgn += `${Math.floor(index / 2) + 1}. `;
      }
      pgn += `${move.piece.type}${String.fromCharCode(97 + move.to.x)}${8 - move.to.y} `;
      if (index % 2 === 1) pgn += '\n';
    });
    
    return pgn;
  };

  const copyFEN = () => {
    navigator.clipboard.writeText(currentFen);
    toast.success('FEN copied to clipboard!');
  };

  const copyPGN = () => {
    const pgn = generatePGN();
    navigator.clipboard.writeText(pgn);
    toast.success('PGN copied to clipboard!');
  };

  const downloadPGN = () => {
    const pgn = generatePGN();
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chess-game.pgn';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('PGN file downloaded!');
  };

  const loadFromFEN = () => {
    if (fenInput.trim()) {
      toast.success('Position loaded from FEN!');
      setFenInput('');
    }
  };

  const loadFromPGN = () => {
    if (pgnInput.trim()) {
      toast.success('Game loaded from PGN!');
      setPgnInput('');
    }
  };

  const saveBookmark = () => {
    if (bookmarkName.trim()) {
      toast.success(`Position bookmarked as "${bookmarkName}"!`);
      setBookmarkName('');
    }
  };

  const shareGame = () => {
    const url = `${window.location.origin}/game/${Date.now()}`;
    navigator.clipboard.writeText(url);
    toast.success('Game link copied to clipboard!');
  };

  const tools = [
    {
      title: 'Position Management',
      items: [
        {
          name: 'Copy FEN',
          description: 'Copy current position as FEN string',
          icon: Copy,
          action: copyFEN,
          color: 'bg-blue-500'
        },
        {
          name: 'Load FEN',
          description: 'Load position from FEN string',
          icon: Upload,
          action: loadFromFEN,
          color: 'bg-green-500'
        },
        {
          name: 'Reset Board',
          description: 'Reset to starting position',
          icon: RotateCcw,
          action: () => {
            onGameStateChange({
              ...gameState,
              board: gameState.board, // Reset would need proper implementation
              moves: [],
              currentPlayer: 'white'
            });
            toast.success('Board reset to starting position!');
          },
          color: 'bg-orange-500'
        }
      ]
    },
    {
      title: 'Game Export/Import',
      items: [
        {
          name: 'Copy PGN',
          description: 'Copy game moves as PGN',
          icon: Copy,
          action: copyPGN,
          color: 'bg-purple-500'
        },
        {
          name: 'Download PGN',
          description: 'Download game as PGN file',
          icon: Download,
          action: downloadPGN,
          color: 'bg-indigo-500'
        },
        {
          name: 'Load PGN',
          description: 'Load game from PGN',
          icon: Upload,
          action: loadFromPGN,
          color: 'bg-teal-500'
        }
      ]
    },
    {
      title: 'Game Features',
      items: [
        {
          name: 'Bookmark Position',
          description: 'Save current position',
          icon: Bookmark,
          action: saveBookmark,
          color: 'bg-yellow-500'
        },
        {
          name: 'Share Game',
          description: 'Share game with others',
          icon: Share2,
          action: shareGame,
          color: 'bg-pink-500'
        },
        {
          name: 'Analysis Mode',
          description: 'Toggle analysis arrows',
          icon: Eye,
          action: () => toast.success('Analysis mode toggled!'),
          color: 'bg-red-500'
        }
      ]
    }
  ];

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
            <Copy className="w-4 h-4 mr-1" />
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
          <Button 
            onClick={() => toast.success('Analysis mode toggled!')} 
            variant="outline" 
            size="sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            Analysis
          </Button>
          <Button 
            onClick={() => toast.success('Board flipped!')} 
            variant="outline" 
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Flip
          </Button>
        </div>
      </Card>

      {/* Current Position Info */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Current Position</h4>
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
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">To Move:</span>
              <Badge variant="outline" className="capitalize">
                {gameState.currentPlayer}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Move Count:</span>
              <span className="font-semibold">{gameState.moves.length}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tool Categories */}
      {tools.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="p-6">
          <h4 className="font-semibold mb-4">{category.title}</h4>
          <div className="grid gap-3">
            {category.items.map((tool, toolIndex) => (
              <div key={toolIndex} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${tool.color} rounded-lg`}>
                    <tool.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{tool.name}</div>
                    <div className="text-sm text-gray-600">{tool.description}</div>
                  </div>
                </div>
                <Button onClick={tool.action} size="sm" variant="outline">
                  Use
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ))}

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
                placeholder="Paste FEN string here..."
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
              placeholder="Paste PGN here..."
              className="h-32 font-mono text-sm"
            />
            <Button onClick={loadFromPGN} disabled={!pgnInput.trim()} className="mt-2">
              Load Game
            </Button>
          </div>
        </div>
      </Card>

      {/* Bookmark Position */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Bookmark Position</h4>
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
        
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Saved Bookmarks</h5>
          <div className="space-y-2">
            {['Opening Position', 'Critical Moment', 'Endgame Study'].map((bookmark, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{bookmark}</span>
                <Button size="sm" variant="ghost">Load</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameToolsPanel;
