import { FC, useEffect } from 'react';
import { master$ } from './config';
import { getLedger } from './helpers/ledger';
import use$, { useNullable$ } from './helpers/use$';
import Login from './component/Login';
import { useStore } from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Modal from './component/Modal';
import SheetPage from './component/Sheet';
import { Sheet } from '@daml.js/daml-project';
import assert from './helpers/assert';
import { key } from './helpers/sheet';
import type Ledger from '@daml/ledger';
import Button from './form/Button';

const App: FC = () => {
  const store = useStore();
  console.log(store);

  const { set, owner } = store;

  const master = use$(master$);

  const ledger = useNullable$(
    master?.identifier,
    getLedger,
  ) as Ledger;

  useEffect(() => {
    if (!master || !ledger) return;
    set({ master, ledger });
  }, [master, ledger]);

  useEffect(() => {
    if (!ledger || !owner || !master) return;

    const skey = key(
      master.identifier,
      'Baracus Rexx',
      owner.identifier,
    );

    ledger
      .fetchByKey(Sheet.Sheet, skey)
      .then((s) => s?.payload)
      .then(assert)
      .then((sheet) => set({ sheet }));
  }, [ledger, owner, master]);

  if (!master || !ledger) return null;

  const isLogged = !!store.owner;
  const hasSheet = !!store.sheet;

  return (
    <section className="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="tracking-tight uppercase font-extrabold mt-6 text-center text-3xl text-gray-900">
        The Ultimate Turn-Based RPG Like Fighting Game
      </h1>

      <Modal show={!isLogged}>
        <Login />
      </Modal>

      {isLogged && hasSheet && (
        <>
          <Button>Find new foe</Button>

          <SheetPage />
        </>
      )}

      {isLogged && !hasSheet && <CreateSheet />}
    </section>
  );
};

export default App;
