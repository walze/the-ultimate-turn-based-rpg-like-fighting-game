import Ledger from '@daml/ledger';
import { mergeMap, of, catchError, from, map } from 'rxjs';
import { array, assert$ } from './one-liners';

export const getParty = (name: string) =>
  mergeMap((l: Ledger) =>
    of(l).pipe(
      mergeMap(() =>
        l.allocateParty({ displayName: name, identifierHint: name }),
      ),
      catchError(() => from(l.listKnownParties())),
      map(array),
      map((p) => p.find((p) => p.displayName === name)),
      assert$('Party not found'),
    ),
  );

export default getParty;
