import { store } from "../utils/store";

import directions from "./directions";

export const selectCellEvent = "cellSelected";

export const createCell = (x, y) => {
  const [getValue, setValue] = store();
  const words = [];
  const button = document.createElement("button");

  const isAt = (coordinates) => coordinates.x === x && coordinates.y === y;

  const isNeighbor = (other) =>
    Object.values(directions).some((direction) => isAt(direction.add(other)));

  const hasValue = (other) => other === store.value;

  button.onclick = (e) => {
    e.preventDefault();
    dispatchEvent(new CustomEvent(selectCellEvent, { detail: { x, y } }));
  };

  return {
    button,
    words,
    x,
    y,
    isAt,
    isNeighbor,
    value: (next) => {
      if (next) {
        setValue(next);
        button.innerHTML = next.toUpperCase();
        button.setAttribute(
          "aria-label",
          `${button.innerHTML}: Row ${y + 1} Column ${x + 1}`
        );

        return next;
      }

      return getValue();
    },
    hasValue,
  };
};
