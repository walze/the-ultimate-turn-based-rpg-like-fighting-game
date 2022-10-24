import { State, useStore } from '../helpers/store';
import Input from '../form/Input';
import { getParty } from '../helpers/party';
import { of } from 'rxjs';
import { FormEvent, useEffect } from 'react';
import Ledger from '@daml/ledger';
import Button from '../form/Button';

const submit =
  (ledger: Ledger, set: (s: Partial<State>) => void) =>
  (e: FormEvent<HTMLFormElement>) => {
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
  };

export default () => {
  const { ledger, set } = useStore();

  useEffect(() => {
    const name = new URL(window.location.href).searchParams.get(
      'username',
    );

    if (ledger && name)
      of(ledger)
        .pipe(getParty(name))
        .subscribe((party) => {
          set({ owner: party });
        });
  }, []);

  if (!ledger) return null;

  return (
    <form
      className="rounded-lg space-y-6"
      onSubmit={submit(ledger, set)}
    >
      <h3 className="text-lg font-bold text-center leading-3 text-gray-900">
        Login
      </h3>

      <Input
        label="Username"
        placeholder="A new challenger approaches..."
      />

      <Button>Sign in</Button>
    </form>
  );
};
