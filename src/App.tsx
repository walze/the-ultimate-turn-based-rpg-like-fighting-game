import { Sheet, Weapon } from '@daml.js/daml-project';
import { FC } from 'react';
import { Party } from './config';
import Select from './form/Select';
import Input from './form/Input';
import getMaster from './helpers/getMaster';
import { getLedger } from './helpers/ledger';
import { createSheet } from './helpers/sheet';
import use$ from './helpers/use$';

export const Sword: Weapon.Weapon = {
  name: 'Sword',
  ad: '10',
};

export const Dagger: Weapon.Weapon = {
  name: 'Dagger',
  ad: '5',
};

const ledger = getLedger(Party.MASTER);
const master = getMaster(ledger);

const BASE_HEALTH = 8;
const WEAPONS = [Sword, Dagger];

const submit = (party: string) => (f: HTMLFormElement) => {
  if (!f) return;
  const ar = Array.from(f.elements) as HTMLInputElement[];
  const inputs = Object.fromEntries(
    ar.filter((e) => e.name).map((e) => [e.name, e.value]),
  );

  const weapon = WEAPONS.find((w) => w.name === inputs['weapon']);
  if (!weapon) return;

  const sheet: Partial<Sheet.Sheet> = {
    name: inputs['name'],
    weapon: weapon,
    hp: BASE_HEALTH * +weapon.ad + '',
  };

  getLedger(party)
    .pipe(createSheet(party, Party.WALLACE, sheet))
    .subscribe(console.warn);
};

const App: FC = () => {
  const m = use$(master);

  if (!m) return <div>Loading...</div>;

  return (
    <main className="p-4 container flex flex-col gap-4">
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Turn-Based Fighting Game
      </h1>

      <form
        className="[&>*]:mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit(m.identifier)(e.currentTarget);
        }}
      >
        <Input label="Name" placeholder="Character name" />

        <Select name="weapon" list={WEAPONS.map((w) => w.name)} />

        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create sheet
        </button>
      </form>
    </main>
  );
};

export default App;
