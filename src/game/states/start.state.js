import { createState } from "../state";
import { createBoard } from "../board/board";
import { createBoardList } from "../board/board-list";
import { createBoardTable } from "../board/board-table";

import { gameState } from "./game.state";

export const startState = ({ screen, stateMachine }) =>
  createState("start", {
    screen,
    stateMachine,
    onEnter: () => {
      const message = document.createElement("p");
      message.innerHTML = "Generating your word search!";
      message.classList.add("message");
      screen.append(message);

      const { board, initialize } = createBoard(10, 10);
      const { grid, words, wordCells } = initialize();
      const list = createBoardList(words);
      const table = createBoardTable(grid);

      setTimeout(() => {
        screen.clear();

        board.append(table, list);
        screen.append(board);

        stateMachine.transition(
          gameState({ screen, stateMachine, grid, words, wordCells })
        );
      }, 1000);
    },
  });
