import {CharAction, Sheet} from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import {ContractId} from '@daml/types';
import {pipe} from 'rxjs';
import {rbind} from './BiFunctor$';

export const acceptSheetCreate = pipe(
  rbind((sheet: Sheet.Sheet, l: Ledger) =>
    l.create(CharAction.CharAction, {sheet}),
  ),
  rbind((a, l) =>
    l.exercise(
      CharAction.CharAction.Create_Accept,
      a.contractId,
      {},
    ),
  ),
);

export const attack = (target: ContractId<Sheet.Sheet>) =>
  pipe(
    rbind((sheet: Sheet.Sheet, l: Ledger) =>
      l.create(CharAction.CharAction, {sheet}),
    ),
    rbind((a, l) =>
      l.exercise(
        CharAction.CharAction.Attack_Accept,
        a.contractId,
        {target},
      ),
    ),
  );
