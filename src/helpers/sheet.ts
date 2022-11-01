import {Sheet} from '@daml.js/daml-project';
import type Ledger from '@daml/ledger';
import {ContractId} from '@daml/types';
import {of, pipe, tap} from 'rxjs';
import {ROLES} from '../config';
import {acceptSheetCreate} from './action';
import assert_id from './assert_id';
import {pure, rbind, rmap, snd$} from './BiFunctor$';
import {extractCreatedExertion} from './extractExertion';
import {findParty} from './user';

export type SheetCreate = Omit<Sheet.Sheet, 'master' | 'owner'>;

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

export const createSheet = (
  masterID: string,
  sheet: SheetCreate,
) =>
  rbind((party: string, l: Ledger) =>
    of([l, party] as const).pipe(
      findParty,
      rmap(assert_id('Found to party to create sheet with')),
      rmap((party) => ({
        ...sheet,
        master: masterID,
        owner: party.identifier,
      })),
      acceptSheetCreate,
      extractCreatedExertion,
      snd$,
    ),
  );

export const deleteSheet = rbind(
  async (k: Sheet.Sheet.Key, l: Ledger) =>
    l.archiveByKey(Sheet.Sheet, k),
);

export const randomSheetTemplate = (name: string) => {
  const role = ROLES[Math.floor(Math.random() * ROLES.length)]!;
  const stance = Math.random() > 0.5 ? 'Attack' : 'Defence';

  const sheet: SheetCreate = {
    name,
    role,
    hp: role.hp,
    stance,
  };

  return sheet;
};

export const changeStance = (action: Sheet.Stance) =>
  pipe(
    rbind(
      (cid: ContractId<Sheet.Sheet>, l: Ledger) =>
        l.exercise(Sheet.Sheet.ChangeStance, cid, {
          action,
        }) as ExerciseFixer<Sheet.Sheet>,
    ),
    extractCreatedExertion,
  );

export const findSheet = pipe(
  rbind((k: Sheet.Sheet.Key, l: Ledger) =>
    l.fetchByKey(Sheet.Sheet, k),
  ),
  rmap((a) => a?.payload),
  snd$,
);
