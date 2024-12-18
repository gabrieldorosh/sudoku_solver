export type SudokuGrid = number[][];
export interface SolveStep {
  row: number;
  col: number;
  num: number;
}

/**
 * Checks if placing `num` at board[row][col] is valid.
 */
function isValid(board: SudokuGrid, row: number, col: number, num: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }

  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }

  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let r = boxRowStart; r < boxRowStart + 3; r++) {
    for (let c = boxColStart; c < boxColStart + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

export function solveSudoku(board: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Solve the Sudoku but collect steps for animation.
 * Returns an array of steps (row, col, num) in the order they are placed.
 */
export function solveSudokuWithSteps(board: SudokuGrid): SolveStep[] {
  const steps: SolveStep[] = [];

  function backtrack(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              steps.push({ row, col, num });
              if (backtrack()) return true;
              board[row][col] = 0;
              // We could also record backtracking steps if desired, but let's keep it simple.
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  backtrack();
  return steps;
}
