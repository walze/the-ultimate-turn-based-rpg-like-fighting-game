import create from 'zustand';

export type StateFN = (s: Partial<State>) => void;

export interface State {
  /** whether it's the owners turn or not */
  turn: boolean;

  player?: CharacterSheet;
  foe?: CharacterSheet;

  set: StateFN;
}

export const useStore = create<State>((set) => ({
  turn: false,

  set,
}));
