export const direction = (x, y) => ({
  x,
  y,
  add: (value) => direction(x + value.x, y + value.y),
});

const up = direction(0, 1);
const down = direction(0, -1);
const left = direction(-1, 0);
const right = direction(1, 0);

export default {
  up,
  down,
  left,
  right,
  upLeft: up.add(left),
  upRight: up.add(right),
  downLeft: down.add(left),
  downRight: down.add(right),
};
