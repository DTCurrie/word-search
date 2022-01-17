export const shuffle = (value) => {
  const result = [...value];
  let current = value.length;
  let random;

  while (current != 0) {
    random = Math.floor(Math.random() * current);
    current--;

    [result[current], result[random]] = [result[random], result[current]];
  }

  return result;
};
