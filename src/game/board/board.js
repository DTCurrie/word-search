import { getAnimals } from "../../data/animals";

import { createGrid } from "../grid";
import { shuffle } from "../shuffle";
import directions from "../directions";

export const createBoard = (width, height) => {
  const wordList = shuffle(getAnimals(width > height ? height : width)).map(
    (animal) => animal.toLowerCase()
  );

  const initialize = () => {
    const initialGrid = createGrid(width, height);
    const words = [];
    const wordCells = {};
    const scale = (width + height) / 2;
    const isScaleEven = scale % 2 === 0;
    const limit = isScaleEven ? scale : scale - 1;

    // Create a stack to record the state of each loop (for referencing back)
    const stack = [
      {
        grid: initialGrid,
        word: wordList.shift(),
        directions: shuffle(Object.values(directions)),
        positions: shuffle(initialGrid.getCells()),
      },
    ];

    while (wordList.length) {
      const current = stack[stack.length - 1];

      if (!current) {
        throw new Error("Unable to create board!");
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
        // If there are no more positions, skip the current word and backtrack to the last loop in the stack
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
          // Store the word
          words.push(current.word);

          // Store the placed cells to check for complete words
          wordCells[current.word.toLowerCase()] = placedCells;
        }
      }

      if (words.length === limit) {
        // All the words have been placed!
        break;
      }

      // We need to place more words, so add another loop to the stack and continue
      const nextLoop = {
        grid: current.grid,
        word: wordList.shift(),
        directions: shuffle(Object.values(directions)),
        positions: shuffle(current.grid.getCells()),
      };

      stack.push(nextLoop);
    }

    const { grid } = stack.pop();
    return { grid, words, wordCells };
  };

  const board = document.createElement("div");
  board.classList.add("board");

  return {
    board,
    initialize,
  };
};
