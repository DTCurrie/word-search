export const store = (initial) => {
  const storedValue = { value: initial };
  const setter = (value) => (storedValue.value = value);
  return [() => storedValue.value, setter];
};
