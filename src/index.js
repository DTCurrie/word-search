import { screen } from "./game/screen";
import { createStateMachine } from "./game/state-machine";
import { initialState } from "./game/states/initial.state";

const stateMachine = createStateMachine();
stateMachine.transition(initialState({ screen: screen(), stateMachine }));
