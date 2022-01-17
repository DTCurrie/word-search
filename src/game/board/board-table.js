import alphabet from "../alphabet";

export const createBoardTable = (grid) => {
  // Create the HTML elements to render the grid
  const table = document.createElement("table");
  const rows = Array.from(new Array(grid.height), (_, x) =>
    document.createElement("tr")
  );

  grid.cells.forEach((column) => {
    column.forEach((cell) => {
      const tableCell = document.createElement("td");

      if (!cell.value()) {
        cell.value(alphabet[Math.floor(Math.random() * alphabet.length)]);
      }

      tableCell.append(cell.button);
      rows[cell.y].append(tableCell);
    });
  });

  table.append(...rows);
  table.classList.add("board-table");

  return table;
};
