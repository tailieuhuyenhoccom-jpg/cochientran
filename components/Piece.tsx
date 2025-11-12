import React from 'react';
import { Piece as PieceProps, Player } from '../types';
import { PIECE_EMOJI } from '../constants';

const Piece: React.FC<{ piece: PieceProps }> = ({ piece }) => {
  const emoji = PIECE_EMOJI[piece.player][piece.type];

  // Sử dụng text-shadow để tạo hiệu ứng viền hoạt động tốt với emoji
  const playerStyle: React.CSSProperties = {
    textShadow:
      piece.player === Player.White
        ? '1px 1px 0 #dc2626, -1px -1px 0 #dc2626, 1px -1px 0 #dc2626, -1px 1px 0 #dc2626, 1px 0 0 #dc2626, -1px 0 0 #dc2626, 0 1px 0 #dc2626, 0 -1px 0 #dc2626' // Viền đỏ (red-600)
        : '1px 1px 0 #2563eb, -1px -1px 0 #2563eb, 1px -1px 0 #2563eb, -1px 1px 0 #2563eb, 1px 0 0 #2563eb, -1px 0 0 #2563eb, 0 1px 0 #2563eb, 0 -1px 0 #2563eb', // Viền xanh (blue-600)
  };

  return (
    <div className="relative flex items-center justify-center">
      <span
        className="text-4xl md:text-5xl lg:text-6xl select-none leading-none transition-transform duration-150 transform group-hover:scale-110"
        style={playerStyle}
        aria-label={`Quân ${piece.type} của bên ${piece.player === Player.White ? 'Đỏ' : 'Xanh'}`}
      >
        {emoji}
      </span>
    </div>
  );
};

export default Piece;