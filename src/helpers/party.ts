import Ledger, {
  PartyInfo,
  UserRight,
  UserRightHelper,
} from '@daml/ledger';
import assert from 'assert';
import { mergeMap, of, catchError, from, map, tap } from 'rxjs';
import { array, assert$ } from './one-liners';

const r = /^[a-z0-9@^$.!`\-#+'~_|:]{1,128}$/;

export const setRights = (l: Ledger, rights: UserRight[] = []) =>
  map((m: PartyInfo) => {
    const id = m.displayName;
    assert(id, `displayName is undefined for ${m.identifier}`);
    assert(r.test(id), `Invalid party name: ${id}`);

    const party = m?.identifier;
    const rs = [
      UserRightHelper.canActAs(party),
      UserRightHelper.canReadAs(party),
      ...rights,
    ];

    // l.grantUserRights(party, rights).then(console.log);
    l.createUser(party, rs, party).catch(() => {
      l.grantUserRights(party, rs).then(console.log);
    });

    return m;
  });

export const getParty = (name: string) =>
  mergeMap((l: Ledger) =>
    of(l).pipe(
      tap(() => assert(r.test(name), `Invalid party name ${name}`)),
      mergeMap(() =>
        l.allocateParty({ displayName: name, identifierHint: name }),
      ),
      catchError(() => from(l.listKnownParties())),
      map(array),
      map((p) => p.find((p) => p.displayName === name)),
      assert$('Party not found'),
      setRights(l),
    ),
  );
