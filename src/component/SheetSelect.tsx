import { useStore } from '../helpers/store';
import Input from '../form/Input';
import { useEffect } from 'react';
import Button from '../form/Button';

export default () => {
  const { set, sheet } = useStore();

  useEffect(() => {
    const name = new URL(window.location.href).searchParams.get(
      'sheet',
    );

    if (name) {
      set({ sheet: { ...sheet, name } });
    }
  }, []);

  return (
    <form
      className="rounded-lg space-y-6"
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get('sheet') as string;
        if (!name) return;

        set({ sheet: { ...sheet, name } });
      }}
    >
      <h3 className="text-lg font-bold text-center leading-3 text-gray-900">
        Select Your Sheet
      </h3>

      <Input
        autoFocus
        label="Your character's name"
        name="sheet"
        placeholder="A new challenger approaches..."
      />

      <Button>
        <span className="font-extrabold tracking-wider">
          FIGHT!
        </span>
      </Button>
    </form>
  );
};
