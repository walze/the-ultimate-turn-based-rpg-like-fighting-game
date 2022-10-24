import { Sheet } from '@daml.js/daml-project';
import { FC } from 'react';
import { master, Party } from './config';
import { getLedger } from './helpers/ledger';
import { key } from './helpers/sheet';
import use$, { useNullable$ } from './helpers/use$';
import { getParty } from './helpers/party';
import CreateSheet from './pages/CreateSheet';
import Login from './pages/Login';

const wallace = getParty(Party.WALLACE);

const App: FC = () => {
  const m = use$(master);
  const l = useNullable$(m?.identifier, getLedger);
  const w = useNullable$(l, wallace);

  if (!m || !l || !w) return null;

  l.fetchByKey(
    Sheet.Sheet,
    key(m.identifier, 'Maximus Minimus', w.identifier),
  ).then(console.log);

  return (
    <main className="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        The Ultimate Turn-Based RPG Like Fighting Game
      </h1>

      <Login />
      {/* <CreateSheet master={m.identifier} /> */}
    </main>
  );
};

export default App;
