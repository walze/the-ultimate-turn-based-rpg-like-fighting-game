import {Sheet} from '@daml.js/daml-project';
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

  /** whether it's the owners turn or not */
  turn: boolean;

  master: string;
  owner?: string;
  foe?: string;

  ledger?: Ledger;

  ownerSheet?: Sheet.Sheet;
  foeSheet?: Sheet.Sheet;

  set: (s: Partial<State>) => void;
}

const DEFAULT_MASTER = 'master_v1';

export const useStore = create<State>((set) => ({
  party: {
    foe: undefined,
    master: undefined,
    owner: undefined,
  },

  turn: true,

  master: DEFAULT_MASTER,

  set,
}));
