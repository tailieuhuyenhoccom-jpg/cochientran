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
            className="absolute"
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
            className="absolute flex items-center justify-center"
            style={{
              top: `${(position.row - 1) * cellSize}%`,
              left: `${(position.col - 1) * cellSize}%`,
              width: `${cellSize * 3}%`,
              height: `${cellSize * 3}%`,
            }}
          >
            <div className="absolute w-full h-full rounded-full border-4 border-gray-200 border-t-transparent animate-spin-once" />
             <div className="text-4xl animate-shake">🔨</div>
          </div>
        );
      case AnimationType.ArrowShot:
        if (!from || !to) return null;
        return (
            <div key={key} className="absolute animate-fly" style={getProjectileStyles()}>
              <span className="text-4xl">🏹</span>
            </div>
        );
      case AnimationType.SwordThrust:
         if (!from || !to) return null;
         return (
             <div key={key} className="absolute animate-fly-fast" style={getProjectileStyles()}>
               <span className="text-4xl">🗡️</span>
             </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
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

        @keyframes spin-once {
          from { transform: rotate(0deg); opacity: 0.8; }
          to { transform: rotate(360deg); opacity: 0; }
        }
        .animate-spin-once { 
            animation: spin-once 0.6s linear forwards; 
        }

        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0); }
          25% { transform: translate(2px, -2px) rotate(15deg); }
          50% { transform: translate(-2px, 2px) rotate(-15deg); }
          75% { transform: translate(2px, 2px) rotate(15deg); }
        }
        .animate-shake {
            animation: shake 0.4s ease-in-out forwards;
            opacity: 1;
            animation-iteration-count: 2;
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
