import Ledger, {
  UserRight,
  UserRightHelper,
} from '@daml/ledger';
import assert from 'assert';
import { of, pipe } from 'rxjs';
import { pair$, rbind, rmap, snd$ } from './BiFunctor$';

const r = /^[a-z0-9@^$.!`\-#+'~_|:]{1,128}$/;

export const createUser = (rights?: UserRight[]) =>
  rmap((name: string, l: Ledger) => {
    assert(!!name, `Name cannot be falsy: ${name}`);
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
  rbind((p: string, l: Ledger) =>
    l
      .allocateParty({
        displayName: p,
        identifierHint: p,
      })
      .catch((e) => {
        console.warn(e);

        return null;
      }),
  ),
);

export const findUser = pipe(
  rbind((id: string, l: Ledger) =>
    l
      .listUsers()
      .then((users) => users.find((u) => u.userId.includes(id))),
  ),
);

export const findParty = pipe(
  rbind((id: string, l: Ledger) =>
    l
      .listKnownParties()
      .then((users) =>
        users.find((u) => u.identifier.includes(id)),
      ),
  ),
);

export const findOrCreate = rbind((p: string, l: Ledger) =>
  of([l, p] as const).pipe(
    findParty,
    rbind((u) => (u ? pair$(l, u) : allocParty(pair$(l, p)))),
    rmap(([, p]) => {
      assert(p, `Failed to allocate party: ${p}`);

      return p;
    }),
    snd$,
  ),
);
