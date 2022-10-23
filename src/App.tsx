import { Sheet, Weapon } from '@daml.js/daml-project';
import { FC } from 'react';
import { Party } from './config';
import Input from './form/Input';
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
    <main className="p-4 container flex flex-col gap-4">
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Turn-Based Fighting Game
      </h1>

      <Input label="Name" placeholder="Character name" />
      <Input label="HP" placeholder="Health Points" />

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
