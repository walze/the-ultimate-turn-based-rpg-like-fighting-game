import { Sheet, Weapon } from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import { FC, useEffect, useState } from 'react';
import { map, mergeMap, Observable } from 'rxjs';
import { getToken } from './config';
import getMaster, { MASTER } from './helpers/getMaster';

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

const WALLACE = 'wallace';
const ledger = getLedger(MASTER);
const master = getMaster(ledger);

const App: FC = () => {
  const m = use$(master);

  console.log(m);

  return (
    <button
      onClick={() => {
        const Sword: Weapon.Weapon = {
          name: 'Sword',
          ad: '10',
        };

        const sheet: Sheet.Sheet = {
          name: 'Bracus Rex',
          hp: '100',
          master: MASTER,
          owner: WALLACE,
          weapon: Sword,
        };

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
