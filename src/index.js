import { createBoard } from "./game/board/board";

(async () => {
  const { list, table } = await createBoard(10);

  document.querySelector("#board").append(table);
  document.querySelector("#board").append(list);
})();
