import { createState } from "../state";

export const winState = ({ screen, stateMachine }) =>
  createState("win", {
    screen,
    stateMachine,
    onEnter: () => {
      const message = document.createElement("p");

      message.innerHTML = "YOU WIN! To play again, press the start button!";

      message.classList.add("message");

      screen.append(message);
      party.confetti(screen.element);
    },
    onExit: () => screen.clear(),
  });
