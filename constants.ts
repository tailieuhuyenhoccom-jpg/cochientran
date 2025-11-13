
import { Piece, PieceType, Player, BoardState } from './types';

export const BOARD_SIZE = 6;

export type Terrain = 'rock' | 'evolution' | 'normal';

export const TERRAIN_LAYOUT: Terrain[][] = (() => {
  const layout: Terrain[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('normal'));
  
  // Rocks
  layout[1][2] = 'rock';
  layout[4][3] = 'rock';
  layout[2][4] = 'rock';
  layout[3][1] = 'rock';

  // Evolution squares
  layout[2][2] = 'evolution';
  layout[3][3] = 'evolution';

  return layout;
})();

export const INITIAL_BOARD: BoardState = (() => {
  const board: BoardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

  const createPiece = (type: PieceType, player: Player): Piece => ({ type, player, isEvolved: false, isDefending: false });

  // Black pieces
  board[0][0] = createPiece(PieceType.Hero, Player.Black);
  board[0][1] = createPiece(PieceType.Horseman, Player.Black);
  board[0][2] = createPiece(PieceType.Archer, Player.Black);
  board[0][3] = createPiece(PieceType.Axeman, Player.Black);
  board[0][4] = createPiece(PieceType.Bomber, Player.Black);
  board[0][5] = createPiece(PieceType.ShieldBearer, Player.Black);

  // White pieces (Rotated setup)
  board[5][5] = createPiece(PieceType.Hero, Player.White);
  board[5][4] = createPiece(PieceType.Horseman, Player.White);
  board[5][3] = createPiece(PieceType.Archer, Player.White);
  board[5][2] = createPiece(PieceType.Axeman, Player.White);
  board[5][1] = createPiece(PieceType.Bomber, Player.White);
  board[5][0] = createPiece(PieceType.ShieldBearer, Player.White);


  return board;
})();

export const PIECE_EMOJI: Record<Player, Record<PieceType, string>> = {
  [Player.White]: {
    [PieceType.Hero]: '⚔️',
    [PieceType.Horseman]: '🐎',
    [PieceType.Archer]: '🎯',
    [PieceType.Axeman]: '🔨',
    [PieceType.Bomber]: '💣',
    [PieceType.ShieldBearer]: '🛡️',
  },
  [Player.Black]: {
    [PieceType.Hero]: '⚔️',
    [PieceType.Horseman]: '🐎',
    [PieceType.Archer]: '🎯',
    [PieceType.Axeman]: '🔨',
    [PieceType.Bomber]: '💣',
    [PieceType.ShieldBearer]: '🛡️',
  },
};
