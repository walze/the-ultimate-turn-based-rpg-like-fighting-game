import { State, useStore } from '../helpers/store';
import Input from '../form/Input';
import { FormEvent, useEffect } from 'react';
import Button from '../form/Button';

const submit =
  (set: (s: Partial<State>) => void) =>
  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const party = formData.get('username') as string;
    if (!party) return;

    set({ owner: party });
  };

export default () => {
  const { set } = useStore();

  useEffect(() => {
    const owner = new URL(window.location.href).searchParams.get(
      'username',
    );

    if (owner) set({ owner });
  }, []);

  return (
    <form
      className="rounded-lg space-y-6"
      onSubmit={submit(set)}
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
