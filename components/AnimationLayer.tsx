
import React from 'react';
import { Animation, AnimationType } from '../types';
import { BOARD_SIZE } from '../constants';

interface AnimationLayerProps {
  animation: Animation | null;
}

const AnimationLayer: React.FC<AnimationLayerProps> = ({ animation }) => {
  if (!animation) {
    return null;
  }

  const { type, from, to, position, key } = animation;
  const cellSize = 100 / BOARD_SIZE;

  const getProjectileStyles = () => {
    if (!from || !to) return {};
    const deltaX = to.col - from.col;
    const deltaY = to.row - from.row;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    return {
      top: `${from.row * cellSize + cellSize / 4}%`,
      left: `${from.col * cellSize + cellSize / 4}%`,
      '--target-x': `${deltaX * cellSize}%`,
      '--target-y': `${deltaY * cellSize}%`,
      transform: `rotate(${angle}deg)`,
    };
  };

  const renderAnimation = () => {
    switch (type) {
      case AnimationType.Explosion:
        if (!position) return null;
        return (
          <div
            key={key}
            className="absolute flex items-center justify-center z-50"
            style={{
              top: `${position.row * cellSize}%`,
              left: `${position.col * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
            }}
          >
            <div className="w-full h-full rounded-full animate-explode" />
          </div>
        );
      case AnimationType.AxeSwing:
        if (!position) return null;
        return (
          <div
            key={key}
            className="absolute flex items-center justify-center z-50 pointer-events-none"
            style={{
              top: `${(position.row - 1) * cellSize}%`,
              left: `${(position.col - 1) * cellSize}%`,
              width: `${cellSize * 3}%`,
              height: `${cellSize * 3}%`,
            }}
          >
            {/* Shockwave ring representing the swing radius */}
            <div className="absolute w-4/5 h-4/5 rounded-full border-[6px] border-gray-100 border-t-gray-400 border-r-transparent opacity-80 shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-spin-fast" />
             {/* The spinning Axe */}
             <div className="text-7xl animate-cleave drop-shadow-2xl filter grayscale-[20%]">🪓</div>
          </div>
        );
      case AnimationType.ArrowShot:
        if (!from || !to) return null;
        return (
            <div key={key} className="absolute animate-fly z-50" style={getProjectileStyles()}>
              <span className="text-4xl">🏹</span>
            </div>
        );
      case AnimationType.SwordThrust:
         if (!from || !to) return null;
         return (
             <div key={key} className="absolute animate-fly-fast z-50" style={getProjectileStyles()}>
               <span className="text-4xl">🗡️</span>
             </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
      {renderAnimation()}
      <style>{`
        @keyframes explode {
          0% { transform: scale(0.5); opacity: 1; background-color: white; }
          50% { background-color: #f59e0b; } /* amber-500 */
          100% { transform: scale(2.5); opacity: 0; background-color: #ef4444; } /* red-500 */
        }
        .animate-explode {
          animation: explode 0.6s ease-out forwards;
        }

        /* Fast spin for the shockwave ring */
        @keyframes spin-fast {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: rotate(360deg) scale(1.1); opacity: 0; }
        }
        .animate-spin-fast { 
            animation: spin-fast 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }

        /* Cleave animation: Rotate rapidly and enlarge */
        @keyframes cleave {
          0% { transform: rotate(0deg) scale(0.5); opacity: 0.5; }
          20% { opacity: 1; transform: rotate(90deg) scale(1.2); }
          100% { transform: rotate(720deg) scale(0.8); opacity: 0; }
        }
        .animate-cleave {
            animation: cleave 0.6s ease-out forwards;
        }

        @keyframes fly {
            0% { transform: translate(0, 0) rotate(var(--angle, 0)); opacity: 1; }
            99% { transform: translate(var(--target-x), var(--target-y)) rotate(var(--angle, 0)); opacity: 1; }
            100% { transform: translate(var(--target-x), var(--target-y)) rotate(var(--angle, 0)); opacity: 0; }
        }
        .animate-fly {
            animation: fly 0.6s ease-in-out forwards;
        }
         .animate-fly-fast {
            animation: fly 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnimationLayer;
