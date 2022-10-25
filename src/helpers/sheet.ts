import { Sheet } from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import {
  mergeMap,
  of,
  map,
  lastValueFrom,
  pipe,
  tap,
} from 'rxjs';
import { BASE_HEALTH, WEAPONS } from '../config';
import { acceptSheetCreate } from './action';
import { bbind, rbind, rmap } from './BiFunctor$';
import { getName } from './name-api';

// export const createSheet_ = (
//   masterID: string,
//   partyName: string,
//   sheet: Partial<Sheet.Sheet>,
// ) =>
//   mergeMap((l: Ledger) =>
//     of(l).pipe(
//       getParty(partyName),
//       map((party) => ({
//         ...sheet,
//         master: masterID,
//         owner: party.identifier,
//       })),
//       mergeMap((sheet) =>
//         l.create(Sheet.Sheet, sheet as Sheet.Sheet),
//       ),
//     ),
//   );

export const createSheet = (
  masterID: string,
  sheet: Partial<Sheet.Sheet>,
) =>
  pipe(
    bbind((l: Ledger, name: string) =>
      of([l, name] as const).pipe(
        getUser(name),
        rmap(
          (party) =>
            ({
              ...sheet,
              master: masterID,
              owner: party.identifier,
            } as Sheet.Sheet),
        ),
        acceptSheetCreate,
        map((sheet) => [l, sheet]),
      ),
    ),
  );

// getName().subscribe(console.log);
// create sheet
// implement choices
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
