
import React from 'react';
import { BoardState, Position } from '../types';
import Square from './Square';
import { Terrain } from '../constants';

interface BoardProps {
  board: BoardState;
  selectedPiece: Position | null;
  validMoves: Position[];
  specialAbilityTargets: Position[];
  terrainLayout: Terrain[][];
  onSquareClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, selectedPiece, validMoves, specialAbilityTargets, terrainLayout, onSquareClick }) => {
  return (
    <div className="grid grid-cols-6 grid-rows-6 aspect-square w-full shadow-2xl border-4 border-amber-900 rounded-md overflow-hidden">
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
              terrain={terrainLayout[rowIndex][colIndex]}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
