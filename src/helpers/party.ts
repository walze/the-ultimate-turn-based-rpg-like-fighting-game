import Ledger, {
  PartyInfo,
  UserRight,
  UserRightHelper,
} from '@daml/ledger';
import assert from 'assert';
import { pipe } from 'rxjs';
import { Party } from '../config';
import assertid from './assertid';
import { rbind, rmap } from './BiFunctor$';

const r = /^[a-z0-9@^$.!`\-#+'~_|:]{1,128}$/;

export const setRights = (rights: UserRight[] = []) =>
  rmap((m: PartyInfo, l: Ledger) => {
    const id = m.displayName;
    assert(id, `displayName is undefined for ${m.identifier}`);
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

// export const getParty_ = (name: string) =>
//   pipe(
//     tap((_: Ledger) =>
//       assert(r.test(name), `Invalid party name ${name}`),
//     ),
//     mergeMap((l) =>
//       of(l).pipe(
//         mergeMap(() => l.listKnownParties()),
//         mergeAll(),
//         find((p) => p.identifier.includes(name)),
//         assert$('Party not found'),
//         catchError(() =>
//           from(
//             l.allocateParty({
//               displayName: name,
//               identifierHint: name,
//             }),
//           ),
//         ),
//         setRights(l),
//       ),
//     ),
//   );

export const getParty = (name: string) =>
  pipe(
    rbind((_, l: Ledger) => l.listKnownParties()),
    rmap((ps) => ps.find((p) => p.identifier.includes(name))),
    rmap((a) => assertid(a, `Party not found`)),
  );

export const getMaster = pipe(
  getParty(Party.MASTER),
  setRights([UserRightHelper.participantAdmin]),
);
