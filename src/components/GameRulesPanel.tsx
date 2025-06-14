
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Crown, Target, Clock, AlertTriangle, CheckCircle, Info, Trophy } from 'lucide-react';

const GameRulesPanel: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  const pieceRules = [
    {
      piece: 'Pawn',
      symbol: '♟',
      moves: 'Forward one square, or two on first move. Captures diagonally.',
      special: 'En passant, promotion to any piece except king when reaching end rank.',
      value: 1
    },
    {
      piece: 'Rook',
      symbol: '♜',
      moves: 'Any number of squares horizontally or vertically.',
      special: 'Can castle with king if neither piece has moved.',
      value: 5
    },
    {
      piece: 'Knight',
      symbol: '♞',
      moves: 'L-shaped: 2 squares in one direction, 1 square perpendicular.',
      special: 'Only piece that can jump over others.',
      value: 3
    },
    {
      piece: 'Bishop',
      symbol: '♝',
      moves: 'Any number of squares diagonally.',
      special: 'Always stays on same color squares.',
      value: 3
    },
    {
      piece: 'Queen',
      symbol: '♛',
      moves: 'Combines rook and bishop moves - any direction, any distance.',
      special: 'Most powerful piece on the board.',
      value: 9
    },
    {
      piece: 'King',
      symbol: '♚',
      moves: 'One square in any direction.',
      special: 'Can castle. Must be protected - game ends if checkmated.',
      value: '∞'
    }
  ];

  const gamePhases = [
    {
      phase: 'Opening',
      description: 'First 10-15 moves focusing on piece development and king safety.',
      principles: [
        'Control the center with pawns (e4, d4, e5, d5)',
        'Develop knights before bishops',
        'Castle early for king safety',
        'Don\'t move the same piece twice without reason',
        'Don\'t bring queen out too early'
      ]
    },
    {
      phase: 'Middlegame',
      description: 'Main battle phase with tactical combinations and strategic maneuvering.',
      principles: [
        'Improve piece positions',
        'Create and exploit weaknesses',
        'Control key squares and files',
        'Coordinate pieces for attacks',
        'Calculate tactical combinations'
      ]
    },
    {
      phase: 'Endgame',
      description: 'Few pieces remain, focus shifts to pawn promotion and checkmate.',
      principles: [
        'Activate the king',
        'Push passed pawns',
        'Coordinate pieces efficiently',
        'Know basic checkmate patterns',
        'Centralize remaining pieces'
      ]
    }
  ];

  const winConditions = [
    { condition: 'Checkmate', description: 'King is in check and cannot escape capture', icon: Crown },
    { condition: 'Resignation', description: 'Player voluntarily gives up the game', icon: AlertTriangle },
    { condition: 'Time Forfeit', description: 'Player runs out of time on their clock', icon: Clock },
    { condition: 'Draw by Agreement', description: 'Both players agree to end the game', icon: CheckCircle },
    { condition: 'Stalemate', description: 'Player has no legal moves but king is not in check', icon: Target },
    { condition: '50-Move Rule', description: 'No capture or pawn move in 50 consecutive moves', icon: Info },
    { condition: 'Threefold Repetition', description: 'Same position occurs three times', icon: Info },
    { condition: 'Insufficient Material', description: 'Neither side has enough pieces to checkmate', icon: Info }
  ];

  const tacticalPatterns = [
    'Fork: Attacking two pieces simultaneously',
    'Pin: Restricting piece movement to protect valuable piece behind',
    'Skewer: Forcing valuable piece to move, exposing less valuable piece',
    'Discovery: Moving piece reveals attack from piece behind',
    'Double Attack: Two separate attacks in one move',
    'Sacrifice: Giving up material for positional or tactical advantage',
    'Deflection: Forcing defending piece away from its duty',
    'Decoy: Luring piece to unfavorable square'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Chess Rules & Strategy Guide</h2>
          </div>
          <p className="text-gray-600">Master the royal game with comprehensive rules and strategic principles</p>
        </div>
      </Card>

      <Tabs defaultValue="pieces" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pieces">Pieces</TabsTrigger>
          <TabsTrigger value="rules">Game Rules</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="tactics">Tactics</TabsTrigger>
          <TabsTrigger value="endgame">Endgame</TabsTrigger>
        </TabsList>

        <TabsContent value="pieces" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Piece Movement & Values
            </h3>
            <div className="grid gap-4">
              {pieceRules.map((piece, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRule(selectedRule === piece.piece ? null : piece.piece)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{piece.symbol}</span>
                      <div>
                        <h4 className="font-semibold text-lg">{piece.piece}</h4>
                        <p className="text-sm text-gray-600">{piece.moves}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {piece.value}
                    </Badge>
                  </div>
                  {selectedRule === piece.piece && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <p className="text-sm text-blue-800 font-medium">Special Rules:</p>
                      <p className="text-sm text-blue-700">{piece.special}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Win/Draw Conditions</h3>
            <div className="grid gap-3">
              {winConditions.map((condition, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <condition.icon className="w-5 h-5 mt-0.5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">{condition.condition}</h4>
                    <p className="text-sm text-gray-600">{condition.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Special Moves</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Castling</h4>
                <p className="text-sm text-gray-600">King moves 2 squares toward rook, rook moves to square king crossed. Both pieces must not have moved, no pieces between them, king not in check.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">En Passant</h4>
                <p className="text-sm text-gray-600">If opponent's pawn moves 2 squares forward and lands beside your pawn, you can capture it as if it moved only 1 square (on the same turn).</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">Pawn Promotion</h4>
                <p className="text-sm text-gray-600">When pawn reaches opposite end of board, it must be promoted to any piece except king (usually queen).</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          {gamePhases.map((phase, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                {phase.phase}
              </h3>
              <p className="text-gray-600 mb-4">{phase.description}</p>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Key Principles:</h4>
                <ul className="space-y-1">
                  {phase.principles.map((principle, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tactics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-600" />
              Tactical Patterns
            </h3>
            <div className="grid gap-3">
              {tacticalPatterns.map((pattern, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start space-x-2">
                    <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                    <p className="text-sm text-gray-700">{pattern}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Calculation Tips</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Look for forcing moves first: checks, captures, threats</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Calculate candidate moves to 3-5 moves deep</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Always check for opponent's threats before moving</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Use the process of elimination for complex positions</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="endgame" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Essential Checkmate Patterns</h3>
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Queen + King vs King</h4>
                <p className="text-sm text-gray-600">Force enemy king to edge, use your king to support queen, deliver checkmate on rank/file.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Rook + King vs King</h4>
                <p className="text-sm text-gray-600">Cut off enemy king with rook, bring your king closer, force to back rank for mate.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Two Bishops + King</h4>
                <p className="text-sm text-gray-600">Force king to corner of same color as one bishop, coordinate pieces for mate.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Bishop + Knight + King</h4>
                <p className="text-sm text-gray-600">Most difficult basic mate - force to corner matching bishop color, 50-move limit.</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Pawn Endgame Principles</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Crown className="w-4 h-4 mt-0.5 text-yellow-600" />
                <span className="text-sm">King activity is paramount</span>
              </div>
              <div className="flex items-start space-x-2">
                <Crown className="w-4 h-4 mt-0.5 text-yellow-600" />
                <span className="text-sm">Create passed pawns when possible</span>
              </div>
              <div className="flex items-start space-x-2">
                <Crown className="w-4 h-4 mt-0.5 text-yellow-600" />
                <span className="text-sm">Opposition: face-off position controlling key squares</span>
              </div>
              <div className="flex items-start space-x-2">
                <Crown className="w-4 h-4 mt-0.5 text-yellow-600" />
                <span className="text-sm">Triangulation: lose a tempo to gain better position</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameRulesPanel;
