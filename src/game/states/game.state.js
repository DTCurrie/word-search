import { createState } from "../state";
import { selectCellEvent } from "../cell";
import { winState } from "./win.state";

const wordSelectedEvent = "wordSelected";

export const gameState = ({ screen, stateMachine, grid, words, wordCells }) => {
  const completedWords = words.reduce((map, word) => {
    map[word.toLowerCase()] = false;
    return map;
  }, {});

  const checkForWordSelected = (e) => {
    const selectedCell = grid.cells[e.detail.x][e.detail.y];
    const selectedCells = grid.selectedCells();

    const wordSelected = selectedCell.words.reduce((value, word) => {
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

    if (wordSelected) {
      dispatchEvent(new CustomEvent(wordSelectedEvent));
    }
  };

  const checkForWin = () => {
    const selectedCells = grid.selectedCells();

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
      stateMachine.transition(winState({ screen, stateMachine }));
    }
  };

  return createState("game", {
    screen,
    stateMachine,
    onEnter: () => {
      addEventListener(selectCellEvent, checkForWordSelected);
      addEventListener(wordSelectedEvent, checkForWin);
    },
    onExit: () => {
      screen.clear();
      removeEventListener(selectCellEvent, checkForWordSelected);
      removeEventListener(wordSelectedEvent, checkForWin);
    },
  });
};
