import Ledger, {UserRight, UserRightHelper} from '@daml/ledger';
import assert from 'assert';
import {map, of, pipe, tap} from 'rxjs';
import {pure, rbind, rmap, snd$} from './BiFunctor$';

const r = /^[a-z0-9@^$.!`\-#+'~_|:]{1,128}$/;

export const createUser = (rights?: UserRight[]) =>
  rbind((name: string, l: Ledger) => {
    assert(!!name, `Name cannot be falsy: ${name}`);
    assert(r.test(name), `Invalid user name: ${name}`);

    return l
      .createUser(
        name,
        rights ?? [
          UserRightHelper.canActAs(name),
          UserRightHelper.canReadAs(name),
        ],
        name,
      )
      .then(() => name)
      .catch(console.error);
  });

export const getOrCreateUser = (rights?: UserRight[]) =>
  pipe(
    rbind((name: string, l: Ledger) =>
      l
        .getUser(name)
        .then((u) => u.userId)
        .catch(() => pure(l, name)),
    ),
    rbind((u) =>
      typeof u === 'string'
        ? of(u)
        : u.pipe(createUser(rights), snd$),
    ),
  );

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
      .then((ps) => ps.find((u) => u.identifier.includes(id))),
  ),
  rbind((p, l) =>
    !p
      ? of(p)
      : pure(l, p.identifier).pipe(
          getOrCreateUser(),
          map(() => p),
        ),
  ),
);

export const findOrCreate = rbind((p: string, l: Ledger) =>
  of([l, p] as const).pipe(
    findParty,
    rbind((u) => (u ? pure(l, u) : allocParty(pure(l, p)))),
    rmap(([, p]) => {
      assert(p, `Failed to allocate party: ${p}`);

      return p;
    }),
    snd$,
  ),
);
