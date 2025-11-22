
import { useState, useCallback, useMemo } from 'react';
import { BoardState, Piece, PieceType, Player, Position, GameState, Animation, AnimationType, GameStats } from '../types';
import { INITIAL_BOARD, BOARD_SIZE, TERRAIN_LAYOUT } from '../constants';
import { produce } from 'immer';

// Utility to check deep equality for positions
const posEquals = (a: Position | null, b: Position | null) => a && b && a.row === b.row && a.col === b.col;
const isValidPosition = (row: number, col: number) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
const getOpponent = (player: Player) => player === Player.White ? Player.Black : Player.White;

const canAxemanUseAbility = (pos: Position, currentBoard: BoardState): boolean => {
    const piece = currentBoard[pos.row][pos.col];
    if (!piece || piece.type !== PieceType.Axeman) {
        return false;
    }
    const opponent = getOpponent(piece.player);
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = pos.row + dr;
            const c = pos.col + dc;
            if (isValidPosition(r, c) && currentBoard[r][c]?.player === opponent) {
                return true; // Found an enemy
            }
        }
    }
    return false; // No enemies nearby
};

const STATS_STORAGE_KEY = 'chienchetran-stats-v4';

const getStatsFromStorage = (): GameStats => {
  try {
    const storedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (storedStats) {
      const parsed = JSON.parse(storedStats);
      if (typeof parsed.redWins === 'number' && typeof parsed.blueWins === 'number' && typeof parsed.draws === 'number') {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Lỗi khi đọc thống kê từ localStorage", error);
  }
  return { redWins: 0, blueWins: 0, draws: 0 };
};

const saveStatsToStorage = (stats: GameStats) => {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Lỗi khi lưu thống kê vào localStorage", error);
  }
};


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
  const [animation, setAnimation] = useState<Animation | null>(null);
  const [history, setHistory] = useState<{ board: BoardState; currentPlayer: Player; moveCount: number }[]>([]);
  const [stats, setStats] = useState<GameStats>(getStatsFromStorage);

  const ANIMATION_DURATION = 600;

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
    setAnimation(null);
    setHistory([]);
  }, []);
  
  const getValidMovesForPiece = (pos: Position, currentBoard: BoardState): Position[] => {
    const moves: Position[] = [];
    const piece = currentBoard[pos.row][pos.col];
    if (!piece) return [];

    const { row, col } = pos;
    const opponent = getOpponent(piece.player);

    if (piece.isEvolved) {
        const evolvedDirections = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        evolvedDirections.forEach(([dr, dc]) => {
            // Check and add 1-square move
            const r1 = row + dr;
            const c1 = col + dc;
            if (isValidPosition(r1, c1) && TERRAIN_LAYOUT[r1][c1] !== 'rock') {
                const targetPiece = currentBoard[r1][c1];
                if (targetPiece === null || targetPiece.player === opponent) {
                    moves.push({ row: r1, col: c1 });
                }
            }
            // Check and add 2-square move
            const r2 = row + dr * 2;
            const c2 = col + dc * 2;
             if (isValidPosition(r2, c2) && TERRAIN_LAYOUT[r2][c2] !== 'rock') {
                const targetPiece = currentBoard[r2][c2];
                if (targetPiece === null || targetPiece.player === opponent) {
                    moves.push({ row: r2, col: c2 });
                }
            }
        });
        return moves;
    }

    const addMove = (r: number, c: number) => {
        if (isValidPosition(r, c) && TERRAIN_LAYOUT[r][c] !== 'rock') {
            const targetPiece = currentBoard[r][c];
            if (targetPiece === null || targetPiece.player === opponent) {
                moves.push({ row: r, col: c });
            }
        }
    };
    
    const addEmptySquareMove = (r: number, c: number) => {
        if (isValidPosition(r, c) && TERRAIN_LAYOUT[r][c] !== 'rock') {
            const targetPiece = currentBoard[r][c];
            if (targetPiece === null) {
                moves.push({ row: r, col: c });
            }
        }
    };

    switch (piece.type) {
        case PieceType.Hero:
        case PieceType.Archer:
            const specialDirections = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            specialDirections.forEach(([dr, dc]) => {
                addEmptySquareMove(row + dr, col + dc);
            });
            break;
        case PieceType.Axeman:
        case PieceType.Bomber:
        case PieceType.ShieldBearer:
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
    if (!piece || piece.isEvolved) return []; // Evolved pieces lose special abilities
    
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

    if (nextGameState !== GameState.Playing) {
      setStats(currentStats => {
        const newStats = { ...currentStats };
        if (nextGameState === GameState.GameOver) {
          if (nextWinner === Player.White) newStats.redWins++;
          else newStats.blueWins++;
        } else if (nextGameState === GameState.Draw) {
          newStats.draws++;
        }
        saveStatsToStorage(newStats);
        return newStats;
      });
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

  const saveToHistory = () => {
    setHistory(prev => [...prev, { board, currentPlayer, moveCount }]);
  };

  const executeMove = useCallback((from: Position, to: Position) => {
    if (animation) return;
    saveToHistory();

    const capturedPiece = board[to.row][to.col];

    // Fix: Bomber only explodes if it is NOT evolved
    if (capturedPiece?.type === PieceType.Bomber && !capturedPiece.isEvolved) {
        // First, show the attacker moving onto the square
        const intermediateBoard = produce(board, draft => {
            const pieceToMove = draft[from.row][from.col];
            if (!pieceToMove) return;
             if (pieceToMove.type === PieceType.ShieldBearer) {
                pieceToMove.isDefending = false;
            }
            draft[to.row][to.col] = pieceToMove;
            draft[from.row][from.col] = null;
        });
        setBoard(intermediateBoard);
        setSelectedPiece(null);
        setValidMoves([]);
        setSpecialAbilityTargets([]);

        // Then, trigger the explosion animation
        setAnimation({ key: Date.now(), type: AnimationType.Explosion, position: to });

        // After the animation, update to the final state where both pieces are gone
        setTimeout(() => {
            const finalBoard = produce(intermediateBoard, draft => {
                draft[to.row][to.col] = null;
            });
            endTurn(finalBoard);
            setAnimation(null);
        }, ANIMATION_DURATION);
    } else {
        // Normal move
        const newBoard = produce(board, draft => {
            const pieceToMove = draft[from.row][from.col];
            if (!pieceToMove) return;
            
            if (pieceToMove.type === PieceType.ShieldBearer) {
                pieceToMove.isDefending = false;
            }

            draft[to.row][to.col] = pieceToMove;
            draft[from.row][from.col] = null;

            // Evolve piece if it lands on an evolution square
            if (TERRAIN_LAYOUT[to.row][to.col] === 'evolution') {
                pieceToMove.isEvolved = true;
            }
        });
        endTurn(newBoard);
    }
  }, [board, currentPlayer, moveCount, moveLimit, animation]);

  const executeArcherShot = useCallback((from: Position, to: Position) => {
    if (animation) return;
    saveToHistory();
    setAnimation({ key: Date.now(), type: AnimationType.ArrowShot, from, to });
    setTimeout(() => {
        const newBoard = produce(board, draft => {
            const targetPiece = draft[to.row][to.col];
            if (targetPiece?.type === PieceType.ShieldBearer && targetPiece.isDefending) {
                return; 
            }
            draft[to.row][to.col] = null;
        });
        endTurn(newBoard);
        setAnimation(null);
    }, ANIMATION_DURATION);
  }, [board, currentPlayer, moveCount, moveLimit, animation]);
  
  const executeHeroStab = useCallback((from: Position, to: Position) => {
    if (animation) return;
    saveToHistory();
    setAnimation({ key: Date.now(), type: AnimationType.SwordThrust, from, to });
    setTimeout(() => {
        const newBoard = produce(board, draft => {
            const targetPiece = draft[to.row][to.col];
            if (targetPiece?.type === PieceType.ShieldBearer && targetPiece.isDefending) {
                return;
            }
            draft[to.row][to.col] = null;
        });
        endTurn(newBoard);
        setAnimation(null);
    }, ANIMATION_DURATION);
  }, [board, currentPlayer, moveCount, moveLimit, animation]);

  const executeAxemanSwing = useCallback((pos: Position) => {
      if (animation) return;
      saveToHistory();
      const piece = board[pos.row][pos.col];
      if (!piece) return;

      setAnimation({ key: Date.now(), type: AnimationType.AxeSwing, position: pos });

      setTimeout(() => {
          const opponent = getOpponent(piece.player);
          const newBoard = produce(board, draft => {
              for(let dr = -1; dr <= 1; dr++) {
                  for(let dc = -1; dc <= 1; dc++) {
                      if (dr === 0 && dc === 0) continue;
                      const r = pos.row + dr;
                      const c = pos.col + dc;
                      if (isValidPosition(r, c)) {
                          const targetPiece = draft[r][c];
                          if (targetPiece && targetPiece.player === opponent) {
                              if (targetPiece.type === PieceType.ShieldBearer && targetPiece.isDefending) {
                                  continue;
                              }
                              draft[r][c] = null;
                          }
                      }
                  }
              }
          });
          endTurn(newBoard);
          setAnimation(null);
      }, ANIMATION_DURATION);
  }, [board, currentPlayer, moveCount, moveLimit, animation]);

    const toggleShieldBearerDefense = useCallback((pos: Position) => {
        if (animation) return;
        saveToHistory();
        const newBoard = produce(board, draft => {
            const piece = draft[pos.row][pos.col];
            if (piece && piece.type === PieceType.ShieldBearer) {
                piece.isDefending = !piece.isDefending;
            }
        });
        endTurn(newBoard);
    }, [board, currentPlayer, moveCount, moveLimit, animation]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameState !== GameState.Playing || animation || TERRAIN_LAYOUT[row][col] === 'rock') return;
    
    const clickedPos = { row, col };
    const pieceAtClick = board[row][col];

    if (selectedPiece) {
        if (posEquals(selectedPiece, clickedPos)) {
            const selectedPieceOnBoard = board[selectedPiece.row][selectedPiece.col];
            
            if (selectedPieceOnBoard?.type === PieceType.ShieldBearer && !selectedPieceOnBoard.isEvolved) {
                if (!selectedPieceOnBoard.isDefending) {
                    toggleShieldBearerDefense(selectedPiece);
                } else {
                    // Deselect if already defending
                    setSelectedPiece(null);
                    setValidMoves([]);
                    setSpecialAbilityTargets([]);
                }
                return;
            }

            if (selectedPieceOnBoard?.type === PieceType.Axeman && !selectedPieceOnBoard.isEvolved && canAxemanUseAbility(selectedPiece, board)) {
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
  }, [board, currentPlayer, selectedPiece, validMoves, specialAbilityTargets, gameState, executeMove, executeArcherShot, executeHeroStab, executeAxemanSwing, toggleShieldBearerDefense, animation]);

  const undoMove = useCallback(() => {
    if (history.length === 0 || animation) return;

    const newHistory = [...history];
    const lastState = newHistory.pop();

    if (lastState) {
        setBoard(lastState.board);
        setCurrentPlayer(lastState.currentPlayer);
        setMoveCount(lastState.moveCount);
        setHistory(newHistory);

        setSelectedPiece(null);
        setValidMoves([]);
        setSpecialAbilityTargets([]);
        setGameState(GameState.Playing);
        setWinner(null);
        setAnimation(null);
    }
  }, [history, animation]);

  const resetStats = useCallback(() => {
    const defaultStats = { redWins: 0, blueWins: 0, draws: 0 };
    setStats(defaultStats);
    saveStatsToStorage(defaultStats);
  }, []);
  
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
    animation,
    handleSquareClick,
    resetGame,
    undoMove,
    canUndo: history.length > 0 && gameState === GameState.Playing,
    stats,
    resetStats,
  };
};
