import { Sheet } from '@daml.js/daml-project';
import Ledger, { PartyInfo } from '@daml/ledger';
import create from 'zustand';

export interface State {
  ledger?: Ledger;
  master?: PartyInfo;
  owner?: PartyInfo;
  sheet?: Sheet.Sheet;
  foe?: PartyInfo;

  set: (s: Partial<State>) => void;
}

export const useStore = create<State>((set) => ({
  set,
}));
