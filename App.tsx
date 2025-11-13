import React, { useState } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import RulesModal from './components/RulesModal';
import AnimationLayer from './components/AnimationLayer';
import { useGameLogic } from './hooks/useGameLogic';
import { TERRAIN_LAYOUT } from './constants';

const App: React.FC = () => {
  const {
    board,
    currentPlayer,
    selectedPiece,
    validMoves,
    specialAbilityTargets,
    gameState,
    winner,
    pieceCounts,
    moveCount,
    moveLimit,
    animation,
    handleSquareClick,
    resetGame,
    undoMove,
    canUndo,
    stats,
    resetStats,
  } = useGameLogic();

  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
       <style>{`
        @keyframes evolved-glow {
          0%, 100% {
            filter: drop-shadow(0 0 5px #fde047) drop-shadow(0 0 8px #fde047);
          }
          50% {
            filter: drop-shadow(0 0 8px #facc15) drop-shadow(0 0 12px #facc15);
          }
        }
        .animate-evolved-glow {
          animation: evolved-glow 1.5s ease-in-out infinite;
        }

        @keyframes pulse-bright {
          0%, 100% {
            background-color: #581c87; /* purple-900 */
            box-shadow: 0 0 10px #a855f7; /* purple-500 */
          }
          50% {
            background-color: #6b21a8; /* purple-800 */
            box-shadow: 0 0 20px #c084fc; /* purple-400 */
          }
        }
        .animate-pulse-bright {
          animation: pulse-bright 2s infinite;
        }

        @keyframes defend-shield-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.6;
            box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.5), inset 0 0 10px 2px rgba(96, 165, 250, 0.7);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.25);
            opacity: 0.8;
            box-shadow: 0 0 25px 10px rgba(59, 130, 246, 0.7), inset 0 0 15px 4px rgba(96, 165, 250, 1);
          }
        }
        .is-defending::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.3) 80%);
            border: 2px solid rgba(147, 197, 253, 0.8); /* blue-300 */
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: defend-shield-pulse 1.8s ease-in-out infinite;
        }
      `}</style>
      <header className="mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 tracking-wider">Cờ Chiến Trận</h1>
        <p className="text-gray-400">
          Bản quyền thuộc về{' '}
          <a
            href="https://www.facebook.com/tailieuhuyenhoc.nguyenthanhdat/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:underline"
          >
            Nguyễn Thành Đạt
          </a>
        </p>
      </header>

      <main className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full max-w-7xl mx-auto">
        <div className="flex-grow flex items-center justify-center w-full lg:w-auto">
          <div className="relative w-full max-w-2xl">
            <Board
              board={board}
              selectedPiece={selectedPiece}
              validMoves={validMoves}
              specialAbilityTargets={specialAbilityTargets}
              terrainLayout={TERRAIN_LAYOUT}
              onSquareClick={handleSquareClick}
            />
            <AnimationLayer animation={animation} />
          </div>
        </div>
        <div className="w-full lg:w-auto">
          <GameInfo
            currentPlayer={currentPlayer}
            pieceCounts={pieceCounts}
            gameState={gameState}
            winner={winner}
            moveCount={moveCount}
            moveLimit={moveLimit}
            onNewGame={resetGame}
            onShowRules={() => setShowRules(true)}
            onUndo={undoMove}
            canUndo={canUndo}
            stats={stats}
            onResetStats={resetStats}
          />
        </div>
      </main>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
};

export default App;
