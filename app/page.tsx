"use client";

import React, { useState, useRef } from "react";
import { solveSudoku, solveSudokuWithSteps, SudokuGrid } from "../lib/sudokuSolver";

export default function Page() {
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [animate, setAnimate] = useState(false);
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [highlightCol, setHighlightCol] = useState<number | null>(null);
  const [highlightBox, setHighlightBox] = useState<[number, number] | null>(null);
  const solvingRef = useRef(false);

  const handleChange = (row: number, col: number, value: string) => {
    if (solvingRef.current) return; // prevent editing while animating
    const val = parseInt(value, 10);
    if ((Number.isInteger(val) && val >= 1 && val <= 9) || value === "") {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value === "" ? 0 : val;
      setBoard(newBoard);
    }
  };

  const handleSolve = () => {
    if (!animate) {
      // Regular solve (no animation)
      const newBoard = board.map((row) => [...row]);
      if (solveSudoku(newBoard)) {
        setBoard(newBoard);
      } else {
        alert("No solution found for the given puzzle.");
      }
    } else {
      // Animated solve
      solvingRef.current = true;
      const originalBoard = board.map((row) => [...row]);
      const steps = solveSudokuWithSteps(originalBoard.map(r => [...r])); // solve on a copy

      if (steps.length === 0 && originalBoard.some(r => r.includes(0))) {
        // If no steps and still zeros, puzzle is unsolvable
        alert("No solution found for the given puzzle.");
        solvingRef.current = false;
        return;
      }

      let index = 0;

      const animateStep = () => {
        if (index >= steps.length) {
          // Done
          // Show final solved board
          const solvedBoard = originalBoard.map(r => [...r]);
          solveSudoku(solvedBoard);
          setBoard(solvedBoard);
          setHighlightRow(null);
          setHighlightCol(null);
          setHighlightBox(null);
          solvingRef.current = false;
          return;
        }

        const currentStep = steps[index];

        // Reconstruct board up to current step
        const tempBoard: SudokuGrid = originalBoard.map(r => [...r]);
        for (let i = 0; i <= index; i++) {
          const s = steps[i];
          tempBoard[s.row][s.col] = s.num;
        }

        // Update board state
        setBoard(tempBoard);

        // Highlight row, col, and box for the current step
        setHighlightRow(currentStep.row);
        setHighlightCol(currentStep.col);
        const boxRowStart = Math.floor(currentStep.row / 3) * 3;
        const boxColStart = Math.floor(currentStep.col / 3) * 3;
        setHighlightBox([boxRowStart, boxColStart]);

        index++;
        setTimeout(animateStep, 0.01);
      };

      animateStep();
    }
  };

  const handleClear = () => {
    if (solvingRef.current) return;
    setBoard(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setHighlightRow(null);
    setHighlightCol(null);
    setHighlightBox(null);
  };

  const isBoxHighlighted = (r: number, c: number) => {
    if (!highlightBox) return false;
    const [br, bc] = highlightBox;
    return r >= br && r < br + 3 && c >= bc && c < bc + 3;
  };

  return (
    <main className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Sudoku Solver</h1>
      <div className="mb-4 flex items-center gap-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={animate}
            onChange={() => setAnimate(!animate)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Animate
          </span>
        </label>
      </div>
      <div className="grid grid-cols-9 border-4 border-black">
        {board.map((row, rIdx) => (
          <React.Fragment key={rIdx}>
            {row.map((cell, cIdx) => {
              // Determine border classes for subgrid lines
              const topBorder = rIdx % 3 === 0 ? "border-t-4 border-black" : "";
              const leftBorder = cIdx % 3 === 0 ? "border-l-4 border-black" : "";
              const bottomBorder = rIdx === 8 ? "border-b-4 border-black" : "";
              const rightBorder = cIdx === 8 ? "border-r-4 border-black" : "";

              // Highlighting logic
              const highlightClasses: string[] = [];
              if (
                highlightRow === rIdx ||
                highlightCol === cIdx ||
                isBoxHighlighted(rIdx, cIdx)
              ) {
                highlightClasses.push(
                  "bg-yellow-200",
                  "transition-colors",
                  "duration-200"
                );
                // Add a distinct animation to the just-placed cell
                if (highlightRow === rIdx && highlightCol === cIdx) {
                  highlightClasses.push("animate-ping-once");
                }
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`
                    relative flex items-center justify-center
                    w-10 h-10 text-xl 
                    border border-gray-300
                    ${topBorder} ${leftBorder} ${bottomBorder} ${rightBorder}
                    ${highlightClasses.join(" ")}
                  `}
                >
                  <input
                    type="text"
                    value={cell === 0 ? "" : cell}
                    onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                    className="
                      w-full h-full text-center
                      focus:outline-none bg-transparent
                      text-gray-800 font-semibold
                    "
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSolve}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          disabled={solvingRef.current}
        >
          Solve
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          disabled={solvingRef.current}
        >
          Clear
        </button>
      </div>
    </main>
  );
}
