import Ledger, {
  PartyInfo,
  UserRight,
  UserRightHelper,
} from '@daml/ledger';
import assert from 'assert';
import { catchError, find, from, pipe } from 'rxjs';
import { Party } from '../config';
import assert_id from './assert_id';
import { pair$, rbind, rmap } from './BiFunctor$';

const r = /^[a-z0-9@^$.!`\-#+'~_|:]{1,128}$/;

export const setRights = (rights: UserRight[] = []) =>
  rmap((m: PartyInfo, l: Ledger) => {
    const id = m.displayName;
    assert(
      id,
      `displayName is undefined for ${m.identifier}`,
    );
    assert(r.test(id), `Invalid party name: ${id}`);

    const party = m?.identifier;
    const rs = [
      UserRightHelper.canActAs(party),
      UserRightHelper.canReadAs(party),
      ...rights,
    ];

    l.getUser(party)
      .then(() => l.grantUserRights(party, rights))
      .catch(() => l.createUser(party, rs, party));

    return m;
  });

const createParty = pipe(
  rbind((name: string, l: Ledger) =>
    l.allocateParty({
      displayName: name,
      identifierHint: name,
    }),
  ),
  setRights(),
);

const findParty = (name: string) =>
  pipe(
    rbind((_: string, l: Ledger) => l.listKnownParties()),
    rbind((ps) =>
      from(ps).pipe(
        find((p) => p.identifier.includes(name)),
      ),
    ),
  );

export const getParty = (name: string) =>
  pipe(
    findParty(name),
    rmap((a, l) => assert_id(l)(a)),
    catchError((e: AssertionError<Ledger>) =>
      pair$(e.data, name).pipe(createParty),
    ),
  );

export const getMaster = pipe(
  getParty(Party.MASTER),
  setRights([UserRightHelper.participantAdmin]),
);
