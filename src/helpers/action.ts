import {CharAction, Sheet} from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import {ContractId} from '@daml/types';
import {pipe} from 'rxjs';
import {rbind} from './BiFunctor$';

export const createAction = rbind(
  (sheet: Sheet.Sheet, l: Ledger) =>
    l.create(CharAction.CharAction, {sheet}),
);

export const acceptSheetCreate = pipe(
  createAction,
  rbind(
    (a, l) =>
      l.exercise(
        CharAction.CharAction.Create_Accept,
        a.contractId,
        {},
      ) as ExerciseFixer<Sheet.Sheet>,
  ),
);

export const suffer = (target: ContractId<Sheet.Sheet>) =>
  pipe(
    createAction,
    rbind(
      (a, l) =>
        l.exercise(
          CharAction.CharAction.Attack_Accept,
          a.contractId,
          {target},
        ) as ExerciseFixer<Sheet.Sheet>,
    ),
  );
