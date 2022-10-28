import {Sheet} from '@daml.js/daml-project';
import type Ledger from '@daml/ledger';
import {ContractId} from '@daml/types';
import {of, lastValueFrom} from 'rxjs';
import {ROLES} from '../config';
import {acceptSheetCreate} from './action';
import assert_id from './assert_id';
import {rbind, rmap} from './BiFunctor$';
import {extractExertion} from './extractExertion';
import {getName} from './name-api';
import {findParty} from './user';

export type SheetCreate = Omit<Sheet.Sheet, 'master' | 'owner'>;

export const createSheet = (
  masterID: string,
  sheet: SheetCreate,
) =>
  rbind((name: string, l: Ledger) =>
    of([l, name] as const).pipe(
      findParty,
      rmap(assert_id('party not find')),
      rmap((party) => ({
        ...sheet,
        master: masterID,
        owner: party.identifier,
      })),
      acceptSheetCreate,
      extractExertion,
    ),
  );

export const deleteSheet = rbind(
  async (k: Sheet.Sheet.Key, l: Ledger) =>
    l.archiveByKey(Sheet.Sheet, k),
);

export const randomSheetTemplate =
  async (): Promise<Sheet.Sheet> => {
    const current_foe = localStorage.getItem('current_foe');
    if (current_foe)
      return JSON.parse(current_foe) as Sheet.Sheet;

    const name = current_foe || (await lastValueFrom(getName()));
    const role =
      ROLES[Math.floor(Math.random() * ROLES.length)]!;

    const r: SheetCreate = {
      name,
      role,
      hp: role.hp,
      stance: 'Defence',
    };

    localStorage.setItem('current_foe', JSON.stringify(r));

    return r as Sheet.Sheet;
  };

export const key = (
  master: string,
  name: string,
  identifier: string,
): Sheet.Sheet.Key => ({
  _1: master,
  _2: {
    _1: name,
    _2: identifier,
  },
});

// check they are all string and not empty
export const isKeyValid = (key: Sheet.Sheet.Key) =>
  key._1 && key._2._1 && key._2._2;

export const changeStance = (action: Sheet.Stance) =>
  rbind(
    (cid: ContractId<Sheet.Sheet>, l: Ledger) =>
      l.exercise(Sheet.Sheet.ChangeStance, cid, {
        action,
      }) as ExerciseFixer<Sheet.Sheet>,
  );
