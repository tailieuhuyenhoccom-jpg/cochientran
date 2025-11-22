
import React from 'react';
import { Piece as PieceProps, Player, PieceType } from '../types';
import { PIECE_EMOJI } from '../constants';

const Piece: React.FC<{ piece: PieceProps }> = ({ piece }) => {
  const emoji = piece.isEvolved ? '🚩' : PIECE_EMOJI[piece.player][piece.type];
  const isRed = piece.player === Player.White;

  // --- Base Styles & Textures ---
  // Metal/Stone look depending on player
  const baseGradient = isRed
    ? 'bg-gradient-to-b from-red-400 via-red-600 to-red-800'
    : 'bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800';

  const baseBorder = isRed ? 'border-red-900' : 'border-blue-900';
  const ringColor = isRed ? 'bg-red-200' : 'bg-blue-200';
  
  // Special visual traits per class
  let pieceSpecificClass = '';
  let animationClass = '';
  let specialEffect = null;

  if (piece.isEvolved) {
      animationClass = 'animate-sway origin-bottom'; // Flag waving
  } else {
      switch (piece.type) {
          case PieceType.Bomber:
              animationClass = 'animate-ticking';
              pieceSpecificClass = 'saturate-150 brightness-110';
              // Sparks/Fuse effect
              specialEffect = (
                  <div className="absolute -top-1 right-2 w-2 h-2 bg-orange-400 rounded-full animate-spark shadow-[0_0_8px_rgba(255,165,0,0.8)] z-30"></div>
              );
              break;
          case PieceType.Horseman:
              animationClass = 'animate-gallop';
              break;
          case PieceType.Archer:
              animationClass = 'animate-sway origin-bottom';
              break;
          case PieceType.Axeman:
              animationClass = 'animate-breath origin-center';
              break;
          case PieceType.Hero:
              animationClass = 'animate-breath origin-bottom';
              // Hero gets a golden glow on base
              pieceSpecificClass = 'drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]';
              break;
          case PieceType.ShieldBearer:
              // Shield bearer is sturdy, no idle animation unless defending
              break;
      }
  }

  const defendingClass = piece.isDefending ? 'is-defending' : '';

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-end pb-2 group piece-container ${defendingClass}`}>
      
      {/* Shadow on the floor (Base Shadow) */}
      <div className="absolute bottom-1.5 w-[75%] h-3 bg-black/60 rounded-[100%] blur-[2px] group-hover:scale-110 transition-transform duration-300"></div>

      {/* The 3D Base (Pedestal) */}
      <div className={`
        relative z-10
        w-[85%] h-[22px] 
        rounded-[100%] 
        ${baseGradient}
        border-b-[5px] ${baseBorder}
        shadow-lg
        flex items-center justify-center
        transition-all duration-300
        group-hover:brightness-110
      `}>
          {/* Texture/Ring Overlay */}
          <div className={`absolute top-0 w-[92%] h-[85%] rounded-[100%] border-[2px] border-white/30 ${ringColor} opacity-20`}></div>
          
          {/* Inner core for bomber (glowing fuse base) */}
          {piece.type === PieceType.Bomber && !piece.isEvolved && (
               <div className="absolute w-[50%] h-[50%] bg-orange-500 rounded-full blur-sm animate-pulse opacity-60"></div>
          )}

           {/* Metallic rim for ShieldBearer */}
           {piece.type === PieceType.ShieldBearer && !piece.isEvolved && (
               <div className="absolute w-[105%] h-[105%] border border-gray-400 rounded-[100%] opacity-50"></div>
          )}
      </div>

      {/* The Character / Figure */}
      <div 
        className={`
            absolute bottom-[12%] z-20 
            transition-transform duration-200 ease-out 
            group-hover:-translate-y-2 
            ${animationClass}
            ${pieceSpecificClass}
        `}
        style={{
            filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.6))'
        }}
      >
        {specialEffect}
        <span
          className="text-5xl md:text-6xl select-none block"
          role="img"
          aria-label={piece.isEvolved ? 'Đại tướng' : piece.type}
        >
          {emoji}
        </span>
        
        {/* Evolution Aura - Gold sparkles */}
        {piece.isEvolved && (
             <div className="absolute -inset-2 bg-yellow-400/20 blur-md rounded-full -z-10 animate-pulse"></div>
        )}
      </div>

      {/* Shield Defense Effect - Explicit Overlay Layer */}
      {piece.type === PieceType.ShieldBearer && piece.isDefending && (
          <div className="absolute bottom-0 w-[120%] h-[110%] z-30 pointer-events-none">
              <div className="w-full h-full bg-blue-500/20 border-2 border-blue-400/60 rounded-t-[50%] rounded-b-[20%] shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-shield-pulse backdrop-blur-[1px]"></div>
              {/* Rotating ring effect inside shield */}
              <div className="absolute bottom-2 left-[10%] w-[80%] h-[20%] border border-blue-300/40 rounded-[100%] animate-spin-slow"></div>
          </div>
      )}

    </div>
  );
};

export default Piece;
