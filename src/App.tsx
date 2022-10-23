import { Sheet } from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import assert from 'assert';
import { FC, useEffect, useState } from 'react';
import { from, map, mergeMap, Observable, of, tap } from 'rxjs';
import { getToken } from './config';

const getLedger = (to: string) =>
  getToken(to).pipe(
    map(
      (token) =>
        new Ledger({
          token,
          wsBaseUrl: 'ws://localhost:6865/',
          httpBaseUrl: 'http://localhost:3000/',
        }),
    ),
  );

const use$ = <T, _>($?: Observable<T>) => {
  const [s, setS] = useState<T | null>(null);

  useEffect(() => {
    const sub = $?.subscribe(setS);

    return () => sub?.unsubscribe();
  }, []);

  return s;
};

const getMaster = (l: Ledger) =>
  l
    .allocateParty({ displayName: MASTER, identifierHint: MASTER })
    .catch(() =>
      l
        .listKnownParties()
        .then((p) => p.find((p) => p.displayName === MASTER))
        .then((p) => {
          assert(p, 'Party not found');
          return p;
        }),
    );

const MASTER = 'Master';
const WALLACE = 'Wallace';
const ledger = getLedger(MASTER);
const master = ledger.pipe(mergeMap(getMaster));

const Sword = {
  name: 'Sword',
  ad: '10',
};

const sheet = {
  name: 'Bracus Rex',
  hp: '100',
  master: MASTER,
  owner: WALLACE,
  weapon: Sword,
};

const App: FC = () => {
  const m = use$(master);

  console.log(m);

  return (
    <button
      onClick={() => {
        ledger
          .pipe(mergeMap((l) => l.create(Sheet.Sheet, sheet)))
          .subscribe(console.log);
      }}
    >
      {m?.displayName}
    </button>
  );
};

export default App;
