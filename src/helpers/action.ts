import {CharAction, Sheet} from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import {ContractId} from '@daml/types';
import {pipe} from 'rxjs';
import {rbind} from './BiFunctor$';
import {extractCreatedExertion} from './extractExertion';

export const createAction = rbind(
  (key: CharAction.CharAction, l: Ledger) =>
    l.create(CharAction.CharAction, key),
);

export const acceptSheetCreate = (sheet: Sheet.Sheet) =>
  pipe(
    createAction,
    rbind(
      (a, l) =>
        l.exercise(
          CharAction.CharAction.Create_Accept,
          a.contractId,
          {sheet},
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
    extractCreatedExertion,
  );
