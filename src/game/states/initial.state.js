import { createState } from "../state";
import { startState } from "./start.state";

export const initialState = ({ screen, stateMachine }) =>
  createState("initial", {
    screen,
    stateMachine,
    onEnter: () => {
      const message = document.createElement("p");
      message.innerHTML = "Press start to begin!";
      message.classList.add("message");
      screen.append(message);

      const startButton = document.querySelector("#startButton");
      startButton.addEventListener("click", (e) => {
        e.preventDefault();
        stateMachine.transition(startState({ screen, stateMachine }));
      });
    },
    onExit: () => screen.clear(),
  });
