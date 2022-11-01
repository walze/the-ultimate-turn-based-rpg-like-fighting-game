import {FormEvent} from 'react';
import {of} from 'rxjs';
import {useStore} from '../helpers/store';
import {ROLES} from '../config';
import Input from '../form/Input';
import Select from '../form/Select';
import {createSheet, SheetCreate} from '../helpers/sheet';
import {snd$} from '../helpers/BiFunctor$';

const formatSheet = (e: FormEvent<HTMLFormElement>) => {
  const {currentTarget: f} = e;
  e.preventDefault();

  if (!f) return;
  const ar = Array.from(f.elements) as HTMLInputElement[];
  const inputs = Object.fromEntries(
    ar.filter((e) => e.name).map((e) => [e.name, e.value]),
  );
  const name = inputs['name'];

  const role = ROLES.find((r) => r.weapon === inputs['weapon']);

  if (!role || !name) return;

  const sheet: SheetCreate = {
    name,
    hp: role.hp,
    role: role,
    stance: 'Defence',
  };

  return sheet;
};

const CreateSheet = () => {
  const {party, ledger, set} = useStore();
  const {master, owner} = party;

  return (
    <form
      className="[&>*]:mb-4"
      onSubmit={(e) => {
        const sheet = formatSheet(e);
        if (!master || !owner || !ledger || !sheet) return;

        of([ledger, owner] as const)
          .pipe(createSheet(master, sheet), snd$)
          .subscribe((e) =>
            set({
              ownerSheet: e.payload,
            }),
          );
      }}
    >
      <Input
        autoFocus
        label="Name"
        placeholder="Character name"
      />

      <Select name="weapon" list={ROLES.map((r) => r.weapon)} />

      <button
        type="submit"
        className="w-full rounded-md border bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create Sheet
      </button>
    </form>
  );
};

export default CreateSheet;
