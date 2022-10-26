import { Sheet } from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import { of, map, lastValueFrom, pipe } from 'rxjs';
import { BASE_HEALTH, WEAPONS } from '../config';
import { acceptSheetCreate } from './action';
import { bbind, rmap } from './BiFunctor$';
import { getName } from './name-api';
import { findParty } from './user';

export const createSheet = (
  masterID: string,
  sheet: Partial<Sheet.Sheet>,
) =>
  bbind((l: Ledger, name: string) =>
    of([l, name] as const).pipe(
      findParty,
      rmap(
        (party) =>
          ({
            ...sheet,
            master: masterID,
            owner: party?.identifier,
          } as Sheet.Sheet),
      ),
      acceptSheetCreate,
      map((sheet) => [l, sheet]),
    ),
  );

export const randomSheetTemplate =
  async (): Promise<Sheet.Sheet> => {
    const current_foe = localStorage.getItem('current_foe');
    if (current_foe)
      return JSON.parse(current_foe) as Sheet.Sheet;

    const name = current_foe || (await lastValueFrom(getName()));
    const weapon =
      WEAPONS[Math.floor(Math.random() * WEAPONS.length)]!;

    const r = {
      name,
      weapon,
      hp: BASE_HEALTH * +weapon.ad + '',
    };

    localStorage.setItem('current_foe', JSON.stringify(r));

    return r as Sheet.Sheet;
  };

export const key = (
  master: string,
  name: string,
  identifier: string,
) => ({
  _1: master,
  _2: {
    _1: name,
    _2: identifier,
  },
});
