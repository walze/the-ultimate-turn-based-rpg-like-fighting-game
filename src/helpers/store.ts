import Ledger, { PartyInfo } from '@daml/ledger';
import create from 'zustand';

interface State {
  ledger?: Ledger;
  master?: PartyInfo;
  owner?: PartyInfo;
  foe?: PartyInfo;

  set: (s: Partial<State>) => void;
}

export const useStore = create<State>((set) => ({
  set,
}));
