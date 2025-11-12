import { useState, useCallback, useMemo } from 'react';
import { BoardState, Piece, PieceType, Player, Position, GameState } from '../types';
import { INITIAL_BOARD, BOARD_SIZE } from '../constants';
import { produce } from 'immer';

// Utility to check deep equality for positions
const posEquals = (a: Position | null, b: Position | null) => a && b && a.row === b.row && a.col === b.col;

export const useGameLogic = () => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.White);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [specialAbilityTargets, setSpecialAbilityTargets] = useState<Position[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.Playing);
  const [winner, setWinner] = useState<Player | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [moveLimit, setMoveLimit] = useState<number | null>(null);

  const pieceCounts = useMemo(() => {
    let white = 0;
    let black = 0;
    for (const row of board) {
      for (const piece of row) {
        if (piece) {
          if (piece.player === Player.White) white++;
          else black++;
        }
      }
    }
    return { white, black };
  }, [board]);

  const resetGame = useCallback((limit: number | null = null) => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setCurrentPlayer(Player.White);
    setSelectedPiece(null);
    setValidMoves([]);
    setSpecialAbilityTargets([]);
    setGameState(GameState.Playing);
    setWinner(null);
    setMoveCount(0);
    setMoveLimit(limit);
  }, []);
  
  const isValidPosition = (row: number, col: number) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

  const getOpponent = (player: Player) => player === Player.White ? Player.Black : Player.White;

  const getValidMovesForPiece = (pos: Position, currentBoard: BoardState): Position[] => {
    const moves: Position[] = [];
    const piece = currentBoard[pos.row][pos.col];
    if (!piece) return [];

    const { row, col } = pos;
    const opponent = getOpponent(piece.player);

    const addMove = (r: number, c: number) => {
        if (isValidPosition(r, c)) {
            const targetPiece = currentBoard[r][c];
            if (targetPiece === null || targetPiece.player === opponent) {
                moves.push({ row: r, col: c });
            }
        }
    };

    switch (piece.type) {
        case PieceType.Hero:
            const heroDirections = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            heroDirections.forEach(([dr, dc]) => {
                const r = row + dr;
                const c = col + dc;
                if (isValidPosition(r, c)) {
                    const targetPiece = currentBoard[r][c];
                    // Hero can only move to empty squares. Capture is a special ability.
                    if (targetPiece === null) {
                        moves.push({ row: r, col: c });
                    }
                }
            });
            break;
        case PieceType.Archer:
        case PieceType.Axeman:
        case PieceType.Bomber:
            // All move 1 square in 8 directions
            const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            directions.forEach(([dr, dc]) => addMove(row + dr, col + dc));
            break;
        case PieceType.Horseman:
            // Moves 2 squares in 8 directions, can jump
             const uniqueHorsemanDirections = [[-2, -2], [-2, 0], [-2, 2], [0, -2], [0, 2], [2, -2], [2, 0], [2, 2]];
             uniqueHorsemanDirections.forEach(([dr, dc]) => addMove(row + dr, col + dc));
            break;
    }
    return moves;
  };
  
  const getSpecialAbilityTargetsForPiece = (pos: Position, currentBoard: BoardState): Position[] => {
    const targets: Position[] = [];
    const piece = currentBoard[pos.row][pos.col];
    if (!piece) return [];
    
    const { row, col } = pos;
    const opponent = getOpponent(piece.player);

    if (piece.type === PieceType.Hero) {
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for(const [dr, dc] of directions) {
            const targetRow = row + dr;
            const targetCol = col + dc;
            if (isValidPosition(targetRow, targetCol)) {
                const targetPiece = currentBoard[targetRow][targetCol];
                if (targetPiece && targetPiece.player === opponent) {
                    targets.push({ row: targetRow, col: targetCol });
                }
            }
        }
    } else if (piece.type === PieceType.Archer) {
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for(const [dr, dc] of directions) {
            const targetRow = row + dr * 2;
            const targetCol = col + dc * 2;
            if (isValidPosition(targetRow, targetCol)) {
                const targetPiece = currentBoard[targetRow][targetCol];
                if (targetPiece && targetPiece.player === opponent) {
                    targets.push({ row: targetRow, col: targetCol });
                }
            }
        }
    }
    return targets;
  };

  const endTurn = (nextBoard: BoardState) => {
    const counts = { white: 0, black: 0 };
    for (const row of nextBoard) {
        for (const piece of row) {
            if (piece) {
                counts[piece.player]++;
            }
        }
    }

    const nextMoveCount = moveCount + 1;
    
    let nextGameState = GameState.Playing;
    let nextWinner: Player | null = null;

    if (counts.white === 0) {
        nextGameState = GameState.GameOver;
        nextWinner = Player.Black;
    } else if (counts.black === 0) {
        nextGameState = GameState.GameOver;
        nextWinner = Player.White;
    } else if (moveLimit !== null && nextMoveCount >= moveLimit) {
        nextGameState = GameState.Draw;
    }

    setBoard(nextBoard);
    setCurrentPlayer(getOpponent(currentPlayer));
    setSelectedPiece(null);
    setValidMoves([]);
    setSpecialAbilityTargets([]);
    setMoveCount(nextMoveCount);
    setGameState(nextGameState);
    setWinner(nextWinner);
  };

  const executeMove = useCallback((from: Position, to: Position) => {
    const piece = board[from.row][from.col];
    if (!piece) return;

    const capturedPiece = board[to.row][to.col];

    const newBoard = produce(board, draft => {
        draft[to.row][to.col] = piece;
        draft[from.row][from.col] = null;
        
        if (capturedPiece?.type === PieceType.Bomber) {
             draft[to.row][to.col] = null; 
        }
    });

    endTurn(newBoard);
  }, [board, currentPlayer, moveCount, moveLimit]);

  const executeArcherShot = useCallback((_from: Position, to: Position) => {
    const newBoard = produce(board, draft => {
        draft[to.row][to.col] = null;
    });
    endTurn(newBoard);
  }, [board, currentPlayer, moveCount, moveLimit]);
  
  const executeHeroStab = useCallback((_from: Position, to: Position) => {
    const newBoard = produce(board, draft => {
        draft[to.row][to.col] = null;
    });
    endTurn(newBoard);
  }, [board, currentPlayer, moveCount, moveLimit]);

  const executeAxemanSwing = useCallback((pos: Position) => {
      const piece = board[pos.row][pos.col];
      if (!piece) return;
      const opponent = getOpponent(piece.player);

      const newBoard = produce(board, draft => {
          for(let dr = -1; dr <= 1; dr++) {
              for(let dc = -1; dc <= 1; dc++) {
                  if (dr === 0 && dc === 0) continue;
                  const r = pos.row + dr;
                  const c = pos.col + dc;
                  if (isValidPosition(r, c) && draft[r][c]?.player === opponent) {
                      draft[r][c] = null;
                  }
              }
          }
      });
      endTurn(newBoard);
  }, [board, currentPlayer, moveCount, moveLimit]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameState !== GameState.Playing) return;
    
    const clickedPos = { row, col };
    const pieceAtClick = board[row][col];

    if (selectedPiece) {
        if (posEquals(selectedPiece, clickedPos)) {
            if (pieceAtClick?.type === PieceType.Axeman) {
                executeAxemanSwing(selectedPiece);
            } else {
                setSelectedPiece(null);
                setValidMoves([]);
                setSpecialAbilityTargets([]);
            }
            return;
        }

        if (validMoves.some(m => posEquals(m, clickedPos))) {
            executeMove(selectedPiece, clickedPos);
            return;
        }

        if (specialAbilityTargets.some(t => posEquals(t, clickedPos))) {
            const selectedPieceType = board[selectedPiece.row][selectedPiece.col]?.type;
            if (selectedPieceType === PieceType.Archer) {
                executeArcherShot(selectedPiece, clickedPos);
            } else if (selectedPieceType === PieceType.Hero) {
                executeHeroStab(selectedPiece, clickedPos);
            }
            return;
        }
        
        if (pieceAtClick && pieceAtClick.player === currentPlayer) {
            setSelectedPiece(clickedPos);
            setValidMoves(getValidMovesForPiece(clickedPos, board));
            setSpecialAbilityTargets(getSpecialAbilityTargetsForPiece(clickedPos, board));
        } else {
            setSelectedPiece(null);
            setValidMoves([]);
            setSpecialAbilityTargets([]);
        }

    } else {
        if (pieceAtClick && pieceAtClick.player === currentPlayer) {
            setSelectedPiece(clickedPos);
            setValidMoves(getValidMovesForPiece(clickedPos, board));
            setSpecialAbilityTargets(getSpecialAbilityTargetsForPiece(clickedPos, board));
        }
    }
  }, [board, currentPlayer, selectedPiece, validMoves, specialAbilityTargets, gameState, executeMove, executeArcherShot, executeHeroStab, executeAxemanSwing]);
  
  return {
    board,
    currentPlayer,
    selectedPiece,
    validMoves,
    specialAbilityTargets,
    gameState,
    winner,
    pieceCounts,
    moveCount,
    moveLimit,
    handleSquareClick,
    resetGame,
  };
};