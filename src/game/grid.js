import { store } from "../utils/store";

import { createCell, selectCellEvent } from "./cell";

export const createGrid = (width, height) => {
  const size = width * height;
  const cells = Array.from(new Array(width), (_, x) =>
    Array.from(new Array(height), (_, y) => createCell(x, y))
  );

  const [getSelectedCells, setSelectedCells] = store([]);

  const getCells = () =>
    cells.flatMap((column) => column.flatMap((row) => row));

  const placeWord = (word, { x, y }, direction) => {
    const letters = word.split("");
    const cellsToPlace = [];
    let column = x;
    let row = y;

    // Place the letters until they have all been placed, or the target cell is out of bounds
    while (
      letters.length &&
      column >= 0 &&
      column <= width - 1 &&
      row >= 0 &&
      row <= height - 1
    ) {
      // Get the letter to be placed,
      const letter = letters[0];
      const cell = cells[column][row];

      if (!cell.value() || cell.hasValue(letter)) {
        // If the cell doesn't have a value or the value is equal to the current letter,
        // add the cell to cells to be placed
        const next = direction.add(cell);
        column = next.x;
        row = next.y;

        cellsToPlace.push({
          x: cell.x,
          y: cell.y,
          value: letter.toLowerCase(),
          word: word.toLowerCase(),
        });

        letters.shift();
      } else {
        // If the cell is occupied by a different letter, break out with the letters remaining
        break;
      }
    }

    // If there are any letters left to place, return null as the word could not be placed completely
    if (letters.length) {
      return null;
    }

    // Place the cells and return them to check against later
    return cellsToPlace.map(({ x, y, value, word }) => {
      const cell = cells[x][y];
      cell.value(value);
      cell.words.push(word);
      return cell;
    });
  };

  const selectCell = ({ x, y }) => {
    const cell = cells[x][y];
    cell.button.classList.add("selected");

    const selectedCells = getSelectedCells();

    if (selectedCells.length) {
      if (cell.isNeighbor(selectedCells[selectedCells.length - 1])) {
        setSelectedCells([...selectedCells, cell]);
      } else {
        selectedCells.forEach(({ button }) =>
          button.classList.remove("selected")
        );

        setSelectedCells([cell]);
      }
    } else {
      setSelectedCells([...selectedCells, cell]);
    }
  };

  const resetSelectedCells = () => setSelectedCells([]);

  addEventListener(selectCellEvent, (e) => selectCell(e.detail));

  return {
    width,
    height,
    size,
    cells,
    getCells,
    selectedCells: () => getSelectedCells(),
    resetSelectedCells,
    placeWord,
  };
};
