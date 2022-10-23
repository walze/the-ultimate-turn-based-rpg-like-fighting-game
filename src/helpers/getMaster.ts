import Ledger, { UserRightHelper } from '@daml/ledger';
import assert from 'assert';
import { catchError, from, map, mergeMap, of, pipe } from 'rxjs';
import { array, assert$ } from './one-liners';

export const MASTER = 'Master';

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

const getMaster = mergeMap((l: Ledger) =>
  of(l).pipe(
    getParty(MASTER),
    map((m) => {
      // const r = /[a-z0-9@^$.!`\\-#+'~_|:]{1,128}/;
      const id = m?.displayName?.toLowerCase();
      assert(id, 'Party not found');

      const party = m?.identifier;
      const rights = UserRightHelper.participantAdmin;

      l.createUser(id, [rights], party);

      return m;
    }),
  ),
);

export default getMaster;
