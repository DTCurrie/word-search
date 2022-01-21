import { store } from "../utils/store";

export const createStateMachine = () => {
  const [getState, setState] = store();

  const transition = (next) => {
    const last = getState();
    last?.onExit(next);
    next.onEnter(last);
    setState(next);
  };

  return {
    getState,
    transition,
  };
};
