import Ledger, {
  PartyInfo,
  UserRight,
  UserRightHelper,
} from '@daml/ledger';
import assert from 'assert';
import {
  mergeMap,
  of,
  catchError,
  from,
  map,
  tap,
  mergeAll,
  find,
  pipe,
} from 'rxjs';
import { assert$ } from './one-liners';

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
      l.grantUserRights(party, rs).then(console.warn);
    });

    return m;
  });

export const getParty = (name: string) =>
  pipe(
    tap((_: Ledger) =>
      assert(r.test(name), `Invalid party name ${name}`),
    ),
    mergeMap((l) =>
      of(l).pipe(
        mergeMap(() => l.listKnownParties()),
        mergeAll(),
        find((p) => p.identifier.includes(name)),
        assert$('Party not found'),
        catchError(() =>
          from(
            l.allocateParty({
              displayName: name,
              identifierHint: name,
            }),
          ),
        ),
        setRights(l),
      ),
    ),
  );
