import { CharAction, Sheet } from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import { pipe } from 'rxjs';
import { rbind } from './BiFunctor$';

export const acceptSheetCreate = pipe(
  rbind((sheet: Sheet.Sheet, l: Ledger) =>
    l.create(CharAction.CharAction, { sheet }),
  ),
  rbind((a, l) =>
    l.exercise(
      CharAction.CharAction.Create_Accept,
      a.contractId,
      {},
    ),
  ),
);
