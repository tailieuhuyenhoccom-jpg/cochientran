
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
}

export interface Piece {
  type: PieceType;
  player: Player;
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
