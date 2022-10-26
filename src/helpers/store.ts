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

  ownerSheet: Partial<Sheet.Sheet>;
  foeSheet: Partial<Sheet.Sheet>;

  set: (s: Partial<State>) => void;
}

const DEFAULT_MASTER = 'master';

export const useStore = create<State>((set) => ({
  party: {
    foe: undefined,
    master: undefined,
    owner: undefined,
  },

  foeSheet: {},
  ownerSheet: {},

  master: DEFAULT_MASTER,

  set,
}));
