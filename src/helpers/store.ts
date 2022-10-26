import { Sheet } from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import create from 'zustand';

export enum Parties {
  master,
  owner,
  foe,
}

type Party = keyof typeof Parties;

export interface State {
  party: {
    [key in Party]: string | undefined;
  };

  master: string;
  owner?: string;
  foe?: string;

  ledger?: Ledger;
  sheet?: Sheet.Sheet;

  set: (s: Partial<State>) => void;
}

const DEFAULT_MASTER = 'master';

export const useStore = create<State>((set) => ({
  party: {
    foe: undefined,
    master: undefined,
    owner: undefined,
  },

  master: DEFAULT_MASTER,

  set,
}));
