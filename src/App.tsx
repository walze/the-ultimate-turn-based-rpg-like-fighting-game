import { FC, useEffect } from 'react';
import { master$ } from './config';
import { getLedger } from './helpers/ledger';
import use$, { useNullable$ } from './helpers/use$';
import Login from './pages/Login';
import { useStore } from './helpers/store';
import CreateSheet from './pages/CreateSheet';
import Modal from './components/Modal';

const App: FC = () => {
  const store = useStore();

  const master = use$(master$);
  const ledger = useNullable$(master?.identifier, getLedger);

  useEffect(() => {
    if (!master || !ledger) return;

    store.set({ master, ledger });
  }, [master, ledger]);

  // l.fetchByKey(
  //   Sheet.Sheet,
  //   key(m.identifier, 'Maximus Minimus', w.identifier),
  // ).then(console.log);

  if (!master || !ledger) return null;

  const isLogged = !!store.owner;

  return (
    <section className="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="uppercase font-extrabold mt-6 text-center text-3xl text-gray-900">
        The Ultimate Turn-Based RPG Like Fighting Game
      </h1>

      <Modal show={!isLogged}>
        <Login />
      </Modal>

      <CreateSheet master={master.identifier} />
    </section>
  );
};

export default App;
