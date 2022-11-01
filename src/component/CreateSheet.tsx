import {useStore} from '../helpers/store';
import {ROLES} from '../config';
import Input from '../form/Input';
import Select from '../form/Select';
import {makeSheet} from '../helpers/sheet';

const CreateSheet = () => {
  const store = useStore();

  console.log(store);

  return (
    <form
      className="[&>*]:mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(
          // @ts-expect-error idk
          new FormData(form),
        );

        const player = makeSheet(data['name'], data['weapon']);

        store.set({
          player,
        });
      }}
    >
      <h1>name your Character</h1>

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
