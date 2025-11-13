import React, { useState } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import RulesModal from './components/RulesModal';
import AnimationLayer from './components/AnimationLayer';
import { useGameLogic } from './hooks/useGameLogic';

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
      <header className="mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 tracking-wider">Cờ Chiến Trận</h1>
        <p className="text-gray-400">Bản quyền thuộc về Nguyễn Thành Đạt</p>
      </header>

      <main className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full max-w-7xl mx-auto">
        <div className="flex-grow flex items-center justify-center w-full lg:w-auto">
          <div className="relative w-full max-w-2xl">
            <Board
              board={board}
              selectedPiece={selectedPiece}
              validMoves={validMoves}
              specialAbilityTargets={specialAbilityTargets}
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
