
export enum Player {
  White = 'white',
  Black = 'black',
}

export enum PieceType {
  Hero = 'hero',       // Hiệp sĩ
  Horseman = 'horseman', // Kỵ binh
  Archer = 'archer',     // Cung thủ
  Axeman = 'axeman',     // Lính búa
  Bomber = 'bomber',     // Lính cảm tử
  ShieldBearer = 'shieldbearer', // Khiên thủ
}

export interface Piece {
  type: PieceType;
  player: Player;
  isEvolved?: boolean;
  isDefending?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export type BoardState = (Piece | null)[][];

export enum GameState {
    Playing = 'playing',
    GameOver = 'gameOver',
    Draw = 'draw',
}

export enum AnimationType {
  Explosion = 'explosion',
  SwordThrust = 'sword-thrust',
  AxeSwing = 'axe-swing',
  ArrowShot = 'arrow-shot',
}

export interface Animation {
  key: number;
  type: AnimationType;
  from?: Position;
  to?: Position;
  position?: Position;
}

export interface GameStats {
  redWins: number;
  blueWins: number;
  draws: number;
}
