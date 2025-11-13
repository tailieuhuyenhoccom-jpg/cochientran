
import React from 'react';
import { Piece as PieceType } from '../types';
import Piece from './Piece';
import { Terrain } from '../constants';

interface SquareProps {
  piece: PieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isSpecialAbilityTarget: boolean;
  terrain: Terrain;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ piece, isLight, isSelected, isValidMove, isSpecialAbilityTarget, terrain, onClick }) => {
  if (terrain === 'rock') {
    return (
      <div className="w-full h-full bg-zinc-600 flex items-center justify-center cursor-not-allowed border border-zinc-700">
        <span className="text-4xl opacity-70" role="img" aria-label="Đá">🪨</span>
      </div>
    );
  }

  const baseBgColor = isLight ? 'bg-amber-200' : 'bg-amber-700';
  const evolutionBgColor = "bg-purple-800 animate-pulse-bright";
  const selectedColor = 'bg-green-500';
  const validMoveColor = 'bg-blue-400 opacity-80';

  let finalBgColor = terrain === 'evolution' ? evolutionBgColor : baseBgColor;
  if (isSelected) {
    finalBgColor = selectedColor;
  }
  
  return (
    <div
      className={`group w-full h-full flex items-center justify-center cursor-pointer transition-colors duration-200 relative ${finalBgColor}`}
      onClick={onClick}
    >
      {terrain === 'evolution' && !piece && (
         <span className="text-3xl opacity-70" role="img" aria-label="Tiến hóa">✨</span>
      )}
      {isValidMove && (
        <div className={`absolute rounded-full w-1/3 h-1/3 ${validMoveColor}`}></div>
      )}
      {isSpecialAbilityTarget && (
        <div className={`absolute border-4 border-dashed border-red-600 w-full h-full`}></div>
      )}
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Square;
