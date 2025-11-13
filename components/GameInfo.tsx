import React, { useState } from 'react';
import { Player, GameState, GameStats } from '../types';

interface GameInfoProps {
  currentPlayer: Player;
  pieceCounts: { white: number; black: number };
  gameState: GameState;
  winner: Player | null;
  moveCount: number;
  moveLimit: number | null;
  onNewGame: (limit: number | null) => void;
  onShowRules: () => void;
  onUndo: () => void;
  canUndo: boolean;
  stats: GameStats;
  onResetStats: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer, pieceCounts, gameState, winner, moveCount, moveLimit, onNewGame, onShowRules, onUndo, canUndo, stats, onResetStats }) => {
  const [selectedLimit, setSelectedLimit] = useState<number | null>(null);
  const limitOptions = [
    { label: 'Vô hạn', value: null },
    { label: '20 nước', value: 20 },
    { label: '40 nước', value: 40 },
    { label: '60 nước', value: 60 },
  ];

  const turnText = currentPlayer === Player.White ? "Lượt của quân Đỏ" : "Lượt của quân Xanh";
  
  const getGameEndMessage = () => {
    if (gameState === GameState.Draw) {
      return "Trò chơi kết thúc! Hòa cờ!";
    }
    if (gameState === GameState.GameOver && winner) {
      const winnerText = winner === Player.White ? "Quân Đỏ thắng!" : "Quân Xanh thắng!";
      return `Trò chơi kết thúc! ${winnerText}`;
    }
    return "Trò chơi kết thúc!";
  };

  const gameEndMessage = getGameEndMessage();

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-xl w-full max-w-md lg:max-w-xs xl:max-w-sm space-y-4">
      <h2 className="text-2xl font-bold text-center text-amber-300">Thông tin ván cờ</h2>

      {gameState === GameState.Playing ? (
        <div className="text-center p-3 rounded-md bg-gray-700">
          <p className="text-lg font-semibold">{turnText}</p>
        </div>
      ) : (
        <div className={`text-center p-3 rounded-md ${gameState === GameState.Draw ? 'bg-yellow-700' : 'bg-green-700'}`}>
          <p className="text-lg font-bold text-white">{gameEndMessage}</p>
        </div>
      )}

      {moveLimit !== null && gameState === GameState.Playing && (
        <div className="text-center">
            <p className="text-lg">Số nước đi còn lại: <span className="font-bold text-amber-300">{moveLimit - moveCount}</span></p>
        </div>
      )}

      <div className="flex justify-around text-center">
        <div>
          <h3 className="text-lg font-semibold">Quân Đỏ</h3>
          <p className="text-2xl">{pieceCounts.white}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Quân Xanh</h3>
          <p className="text-2xl">{pieceCounts.black}</p>
        </div>
      </div>
      
      <div className="pt-2 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-center mb-2">Thống kê</h3>
        <div className="flex justify-around text-center bg-gray-700 p-2 rounded-md">
          <div>
            <h4 className="text-md font-semibold text-red-400">Đỏ thắng</h4>
            <p className="text-xl">{stats.redWins}</p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-blue-400">Xanh thắng</h4>
            <p className="text-xl">{stats.blueWins}</p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-yellow-400">Hòa</h4>
            <p className="text-xl">{stats.draws}</p>
          </div>
        </div>
        <button 
          onClick={onResetStats} 
          className="w-full mt-2 bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
        >
          Xóa thống kê
        </button>
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-semibold text-center mb-2">Giới hạn nước đi (Ván sau)</h3>
        <div className="grid grid-cols-2 gap-2">
          {limitOptions.map(opt => (
            <button
              key={opt.label}
              onClick={() => setSelectedLimit(opt.value)}
              className={`py-2 px-3 rounded-lg transition-colors ${
                selectedLimit === opt.value
                  ? 'bg-amber-500 text-gray-900 font-bold'
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 pt-2">
        <button 
          onClick={() => onNewGame(selectedLimit)} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          Ván mới
        </button>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
        >
          Hoàn tác
        </button>
        <button 
          onClick={onShowRules} 
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          Luật chơi
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
