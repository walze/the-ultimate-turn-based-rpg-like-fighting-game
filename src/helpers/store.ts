import { Sheet } from '@daml.js/daml-project';
import Ledger, { PartyInfo, User } from '@daml/ledger';
import create from 'zustand';

export enum Parties {
  master,
  owner,
  foe,
}

type getParty = (
  party: keyof typeof Parties,
) => User | undefined;

export interface State {
  parties: User[];

  master: string;
  owner?: string;
  foe?: string;

  party: getParty;

  ledger?: Ledger;
  sheet?: Sheet.Sheet;

  names: readonly [
    master: string,
    owner: string | undefined,
    foe: string | undefined,
  ];

  set: (s: Partial<State>) => void;
}

const DEFAULT_MASTER = 'master';

export const useStore = create<State>((set) => ({
  parties: [],
  master: DEFAULT_MASTER,

  get names(): [string, string | undefined, string | undefined] {
    return [this.master, this.owner, this.foe];
  },

  party(p) {
    const party = this[p];
    if (!party) return undefined;

    return this.parties.find((p) =>
      p.primaryParty!.includes(party),
    );
  },

  set,
}));
