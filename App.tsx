
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
        /* --- General Animations --- */
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        /* --- Role Specific Animations --- */
        
        /* Horseman: Rhythmic galloping motion */
        @keyframes gallop {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-1px) rotate(1deg); }
        }
        .animate-gallop {
          animation: gallop 1.2s ease-in-out infinite;
        }

        /* Archer & Flag: Gentle swaying/aiming */
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }

        /* Axeman & Hero: Heavy breathing/ready stance */
        @keyframes breath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-breath {
          animation: breath 2.5s ease-in-out infinite;
        }

        /* Bomber: Unstable vibration */
        @keyframes ticking {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, -1px); }
          75% { transform: translate(1px, -1px); }
          100% { transform: translate(0, 0); }
        }
        .animate-ticking {
          animation: ticking 0.2s linear infinite;
        }

        /* --- Evolution Effects --- */

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

        /* --- Shield Defense Effect --- */

        @keyframes shield-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
            box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.4);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
            box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.7);
          }
        }
        .animate-shield-pulse {
            animation: shield-pulse 2s ease-in-out infinite;
        }

        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
        }

        /* Spark effect for bomber */
        @keyframes spark-flash {
           0%, 100% { opacity: 0; transform: scale(0.5); }
           50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-spark {
            animation: spark-flash 0.5s ease-out infinite;
        }
      `}</style>
      <header className="mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 tracking-wider drop-shadow-lg">Cờ Chiến Trận</h1>
        <p className="text-gray-400 text-sm mt-1">
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
