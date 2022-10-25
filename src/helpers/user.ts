import Ledger, {
  User,
  UserRight,
  UserRightHelper,
} from '@daml/ledger';
import assert from 'assert';
import { map, of, pipe } from 'rxjs';
import { rbind, rmap } from './BiFunctor$';

const r = /^[a-z0-9@^$.!`\-#+'~_|:]{1,128}$/;

export const createUser = (rights?: UserRight[]) =>
  rmap((name: string, l: Ledger) => {
    assert(r.test(name), `Invalid user name: ${name}`);

    l.createUser(
      name,
      rights ?? [
        UserRightHelper.canActAs(name),
        UserRightHelper.canReadAs(name),
      ],
      name,
    ).catch(console.error);

    return name;
  });

export const allocParty = pipe(
  rbind((u: User, l: Ledger) =>
    l
      .allocateParty({
        displayName: u.userId,
        identifierHint: u.userId,
      })
      .then((p) => {
        u.primaryParty = p.identifier;

        return u;
      })
      .catch((e) => {
        console.warn(e);

        return null;
      }),
  ),
);

export const findUser = pipe(
  rbind((id: string, l: Ledger) =>
    l.getUser(id).catch(() => null),
  ),
  rbind((u, l) => {
    if (u?.primaryParty || !u) return of(u);

    return of([l, u] as const).pipe(
      allocParty,
      map((a) => a[1]),
    );
  }),
);
