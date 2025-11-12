
import { Piece, PieceType, Player, BoardState } from './types';

export const BOARD_SIZE = 5;

export const INITIAL_BOARD: BoardState = (() => {
  const board: BoardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

  const createPiece = (type: PieceType, player: Player): Piece => ({ type, player });

  // Black pieces
  board[0][0] = createPiece(PieceType.Hero, Player.Black);
  board[0][1] = createPiece(PieceType.Horseman, Player.Black);
  board[0][2] = createPiece(PieceType.Archer, Player.Black);
  board[0][3] = createPiece(PieceType.Axeman, Player.Black);
  board[0][4] = createPiece(PieceType.Bomber, Player.Black);

  // White pieces (Rotated setup)
  board[4][4] = createPiece(PieceType.Hero, Player.White);
  board[4][3] = createPiece(PieceType.Horseman, Player.White);
  board[4][2] = createPiece(PieceType.Archer, Player.White);
  board[4][1] = createPiece(PieceType.Axeman, Player.White);
  board[4][0] = createPiece(PieceType.Bomber, Player.White);

  return board;
})();

export const PIECE_EMOJI: Record<Player, Record<PieceType, string>> = {
  [Player.White]: {
    [PieceType.Hero]: '⚔️',
    [PieceType.Horseman]: '🐎',
    [PieceType.Archer]: '🎯',
    [PieceType.Axeman]: '🔨',
    [PieceType.Bomber]: '💣',
  },
  [Player.Black]: {
    [PieceType.Hero]: '⚔️',
    [PieceType.Horseman]: '🐎',
    [PieceType.Archer]: '🎯',
    [PieceType.Axeman]: '🔨',
    [PieceType.Bomber]: '💣',
  },
};