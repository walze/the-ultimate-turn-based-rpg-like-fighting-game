import { useStore } from '../helpers/store';
import Input from '../form/Input';
import { useEffect } from 'react';
import Button from '../form/Button';
import cookie from 'js-cookie';
import { Sheet } from '@daml.js/daml-project';
import assert_id from '../helpers/assert_id';
import { isKeyValid, key } from '../helpers/sheet';

export default () => {
  const { set, sheet, ledger, party } = useStore();

  const handleSubmit = (name: string) => {
    cookie.set('sheet', name, { expires: 0.004 });

    set({ sheet: { ...sheet, name } });
  };

  useEffect(() => {
    const name = sheet.name || cookie.get('sheet') || '';
    const skey = key(
      party.master || '',
      name,
      party.owner || '',
    );

    if (!ledger || !isKeyValid(skey)) return;

    ledger
      .fetchByKey(Sheet.Sheet, skey)
      .then((s) => s?.payload)
      .then(assert_id())
      .then((sheet) => set({ sheet }))
      .catch(() => {
        console.warn('No sheet found for', name);

        cookie.remove('sheet');
      });
  }, [ledger, sheet.name]);

  return (
    <form
      className="rounded-lg space-y-6"
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get('sheet') as string;
        if (!name) return;

        handleSubmit(name);
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
