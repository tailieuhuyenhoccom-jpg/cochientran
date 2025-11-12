import React from 'react';
import { BoardState, Position } from '../types';
import Square from './Square';

interface BoardProps {
  board: BoardState;
  selectedPiece: Position | null;
  validMoves: Position[];
  specialAbilityTargets: Position[];
  onSquareClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, selectedPiece, validMoves, specialAbilityTargets, onSquareClick }) => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 aspect-square w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl shadow-2xl border-4 border-amber-900 rounded-md overflow-hidden">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 !== 0;
          const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
          const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
          const isSpecialAbilityTarget = specialAbilityTargets.some(target => target.row === rowIndex && target.col === colIndex);
          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isLight={isLight}
              isSelected={isSelected}
              isValidMove={isValidMove}
              isSpecialAbilityTarget={isSpecialAbilityTarget}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
