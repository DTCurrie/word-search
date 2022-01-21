export const screen = () => {
  const element = document.querySelector("#screen");

  const clear = () => (element.innerHTML = "");

  return {
    element,
    clear,
    append: (nodes) => element.append(nodes),
    prepend: (nodes) => element.prepend(nodes),
  };
};
