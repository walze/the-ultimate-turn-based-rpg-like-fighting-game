import { useStore } from '../helpers/store';
import Input from '../form/Input';
import { getParty } from '../helpers/party';
import { of } from 'rxjs';

export default () => {
  const { ledger, set } = useStore();

  if (!ledger) return null;

  return (
    <form
      className="py-8 sm:px-6 px-4 shadow-md sm:rounded-lg space-y-6"
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const party = formData.get('username') as string;
        if (!ledger || !party) return;

        of(ledger)
          .pipe(getParty(party))
          .subscribe((party) => {
            set({ owner: party });
          });
      }}
    >
      <Input
        label="Username"
        placeholder="A new challenger approaches..."
      />

      <button
        type="submit"
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Sign in
      </button>
    </form>
  );
};
