import React from 'react';
import { Piece as PieceType } from '../types';
import Piece from './Piece';

interface SquareProps {
  piece: PieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isSpecialAbilityTarget: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ piece, isLight, isSelected, isValidMove, isSpecialAbilityTarget, onClick }) => {
  const bgColor = isLight ? 'bg-amber-200' : 'bg-amber-700';
  const selectedColor = 'bg-green-500';
  const validMoveColor = 'bg-blue-400 opacity-80';

  let finalBgColor = bgColor;
  if (isSelected) {
    finalBgColor = selectedColor;
  }
  
  return (
    <div
      className={`group w-full h-full flex items-center justify-center cursor-pointer transition-colors duration-200 relative ${finalBgColor}`}
      onClick={onClick}
    >
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
