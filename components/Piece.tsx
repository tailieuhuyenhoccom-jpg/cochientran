
import React from 'react';
import { Piece as PieceProps, Player } from '../types';
import { PIECE_EMOJI } from '../constants';

const Piece: React.FC<{ piece: PieceProps }> = ({ piece }) => {
  const emoji = PIECE_EMOJI[piece.player][piece.type];

  // Sử dụng text-shadow để tạo hiệu ứng viền hoạt động tốt với emoji
  // Tăng độ dày viền từ 1px lên 2px
  const playerStyle: React.CSSProperties = {
    textShadow:
      piece.player === Player.White
        ? '2px 2px 0 #dc2626, -2px -2px 0 #dc2626, 2px -2px 0 #dc2626, -2px 2px 0 #dc2626, 2px 0 0 #dc2626, -2px 0 0 #dc2626, 0 2px 0 #dc2626, 0 -2px 0 #dc2626' // Viền đỏ dày hơn
        : '2px 2px 0 #2563eb, -2px -2px 0 #2563eb, 2px -2px 0 #2563eb, -2px 2px 0 #2563eb, 2px 0 0 #2563eb, -2px 0 0 #2563eb, 0 2px 0 #2563eb, 0 -2px 0 #2563eb', // Viền xanh dày hơn
  };

  const wrapperClass = piece.isEvolved ? 'animate-evolved-glow' : '';
  const defendingClass = piece.isDefending ? 'is-defending' : '';

  return (
    <div className={`relative flex items-center justify-center ${wrapperClass} ${defendingClass}`}>
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
