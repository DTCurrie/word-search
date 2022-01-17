import { getAnimals } from "../../data/animals";

import { selectCellEvent } from "../cell";
import { createGrid } from "../grid";
import { shuffle } from "../shuffle";
import directions from "../directions";

import { createBoardList } from "./board-list";
import { createBoardTable } from "./board-table";

export const createBoard = (scale) => {
  const initialGrid = createGrid(scale, scale);

  const wordList = shuffle(getAnimals(scale))
    .slice(0, Math.floor((initialGrid.width + initialGrid.height) / 2))
    .map((animal) => animal.toLowerCase());

  const words = shuffle(wordList);
  const completedWords = wordList.reduce((map, word) => {
    map[word.toLowerCase()] = false;
    return map;
  }, {});

  const wordCells = {};

  // Create a stack to record the state of each loop (for referencing back)
  const stack = [
    {
      grid: initialGrid,
      word: words.shift(),
      directions: shuffle(Object.values(directions)),
      positions: shuffle(initialGrid.getCells()),
    },
  ];

  const checkForWin = (grid, cell) => {
    const selectedCells = grid.selectedCells();

    const hasSelectedWord = cell.words.reduce((value, word) => {
      if (!value) {
        const cells = wordCells[word];

        if (cells.length === selectedCells.length) {
          for (let i = 0; i < selectedCells.length; i++) {
            const selectedCell = selectedCells[i];
            const selectedWordCell = cells[i];

            if (selectedCell.isAt(selectedWordCell)) {
              return true;
            }
          }
        }
      }

      return value;
    }, false);

    if (hasSelectedWord) {
      selectedCells.forEach(({ button }) => {
        button.classList.add("completed");
      });

      const word = selectedCells
        .reduce((word, current) => {
          return `${word}${current.value()}`;
        }, "")
        .toLowerCase();

      document.querySelector(`[data-word=${word}]`).classList.add("completed");

      completedWords[word] = true;

      selectedCells.forEach((cell) => cell.button.classList.remove("selected"));
      grid.resetSelectedCells();

      if (!Object.values(completedWords).includes(false)) {
        console.log("game is completed!");
      }
    }
  };

  while (true) {
    try {
      // Get the current loop off the stack and throw an error if no solution is possible
      const current = stack[stack.length - 1];

      if (!current) {
        return createBoard();
      }

      // get the current direction to try
      let direction = current.directions.pop();

      if (!direction) {
        // if all possible directions are exhausted, pop the current position off the stack and
        // reset the list of directions
        current.positions.pop();
        current.directions = shuffle(Object.values(directions));
        direction = current.directions.pop();
      }

      // Get the current position
      let position = current.positions.pop();

      if (!position) {
        // If there are no more positions, put the current word back in the list of words and backtrack
        // to the last loop in the stack
        words.unshift(current.word);
        stack.pop();
      } else {
        // Try to place the word on the grid, creating a copy in the process to preserve the stack history
        const placedCells = current.grid.placeWord(
          current.word,
          position,
          direction
        );

        // If tryWord succeeds, it will return the next grid with the word placed on it; otherwise null
        if (placedCells !== null) {
          // Store the placed cells to check for complete words
          wordCells[current.word.toLowerCase()] = placedCells;

          if (words.length > 0) {
            // There are more words, so add another loop to the stack and continue
            const nextLoop = {
              grid: current.grid,
              word: words.shift(),
              directions: shuffle(Object.values(directions)),
              positions: shuffle(current.grid.getCells()),
            };

            stack.push(nextLoop);
          } else {
            // All the words have been placed!
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
      break;
    }
  }

  const grid = stack[stack.length - 1].grid;

  addEventListener(selectCellEvent, (e) =>
    checkForWin(grid, grid.cells[e.detail.x][e.detail.y])
  );

  return {
    grid,
    list: createBoardList(wordList),
    table: createBoardTable(grid),
    wordCells,
    wordList,
  };
};
