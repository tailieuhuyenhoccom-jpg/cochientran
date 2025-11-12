import React, { useState } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import RulesModal from './components/RulesModal';
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
    handleSquareClick,
    resetGame,
  } = useGameLogic();

  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <header className="mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 tracking-wider">Cờ Chiến Trận</h1>
        <p className="text-gray-400">Một biến thể cờ vua chiến thuật mới</p>
      </header>

      <main className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full max-w-7xl mx-auto">
        <div className="flex-grow flex items-center justify-center w-full lg:w-auto">
          <Board
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            specialAbilityTargets={specialAbilityTargets}
            onSquareClick={handleSquareClick}
          />
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
          />
        </div>
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Phát triển bởi Nguyễn Thành Đạt</p>
      </footer>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
};

export default App;