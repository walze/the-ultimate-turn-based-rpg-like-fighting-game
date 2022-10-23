import { Sheet, Weapon } from '@daml.js/daml-project';
import { FC } from 'react';
import { Party } from './config';
import getMaster from './helpers/getMaster';
import { getLedger } from './helpers/ledger';
import { createSheet } from './helpers/sheet';
import use$ from './helpers/use$';

const ledger = getLedger(Party.MASTER);
const master = getMaster(ledger);

const App: FC = () => {
  const m = use$(master);

  if (!m) return <div>Loading...</div>;

  return (
    <main
      style={{
        maxWidth: '512ppx',
        display: 'flex',
        flexDirection: 'column',
        margin: '1rem auto',
      }}
    >
      <pre>{JSON.stringify(m, null, 2)}</pre>

      <button
        onClick={() => {
          const Sword: Weapon.Weapon = {
            name: 'Sword',
            ad: '10',
          };

          const sheet: Sheet.Sheet = {
            name: 'Bracus Rex',
            hp: '100',
            master: '',
            owner: '',
            weapon: Sword,
          };

          getLedger(m.identifier)
            .pipe(createSheet(m.identifier, Party.WALLACE, sheet))
            .subscribe(console.warn);
        }}
      >
        {m?.displayName}
      </button>
    </main>
  );
};

export default App;
