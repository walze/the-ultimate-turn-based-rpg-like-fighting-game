import { FormEvent } from 'react';
import { of } from 'rxjs';
import { WEAPONS, BASE_HEALTH, Party } from '../config';
import Input from '../form/Input';
import Select from '../form/Select';
import { getLedger } from '../helpers/ledger';
import { createSheet } from '../helpers/sheet';

const submit = (party: string) => (e: FormEvent<HTMLFormElement>) => {
  const { currentTarget: f } = e;
  e.preventDefault();

  if (!f) return;
  const ar = Array.from(f.elements) as HTMLInputElement[];
  const inputs = Object.fromEntries(
    ar.filter((e) => e.name).map((e) => [e.name, e.value]),
  );

  const weapon = WEAPONS.find((w) => w.name === inputs['weapon']);
  if (!weapon) return;

  // @ts-ignore
  const sheet: Partial<Sheet.Sheet> = {
    name: inputs['name'],
    weapon: weapon,
    hp: BASE_HEALTH * +weapon.ad + '',
  };

  getLedger(of(party))
    .pipe(createSheet(party, Party.WALLACE, sheet))
    .subscribe(console.warn);
};

type Props = {
  master: string;
};

export default ({ master }: Props) => (
  <form className="[&>*]:mb-4" onSubmit={submit(master)}>
    <Input label="Name" placeholder="Character name" />

    <Select name="weapon" list={WEAPONS.map((w) => w.name)} />

    <button
      type="submit"
      className="w-full rounded-md border bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Create Sheet
    </button>
  </form>
);
