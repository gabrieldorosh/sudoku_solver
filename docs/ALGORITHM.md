# Sudoku Solving Algorithm

This solver uses a simple backtracking algorithm implemented in `lib/sudokuSolver.ts`.

1. **Search for empty cells** - The algorithm scans the grid for the next empty cell.
2. **Try numbers 1-9** - For each empty cell, the algorithm tries numbers from 1 through 9 and checks whether the number can be placed without violating Sudoku rules (no duplicates in the same row, column, or 3x3 box).
3. **Recursive Backtracking** - If a number fits, the solver places it and recursively attempts to solve the rest of the board. If a dead end is reached, it backtracks by resetting the cell to `0` and tries the next number.
4. **Animation steps** - When running iwth animations enabled, each placement is recorded as a step (`row`, `col`, `num`). These steps are used by the UI to visualise the solving process.

This approach guarantees a solution for valid Sudoku puzzles and is a great illustration of how backtracking works.