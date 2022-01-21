export const createState = (
  name,
  { screen, stateMachine, onEnter, onExit }
) => {
  return {
    name,
    screen,
    stateMachine,
    onEnter: (last) => onEnter?.(last),
    onExit: (next) => onExit?.(next),
  };
};
