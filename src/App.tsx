import { FC, useEffect } from 'react';
import { getLedger, _ledger } from './helpers/ledger';
import use$ from './helpers/use$';
import Login from './component/Login';
import { useStore } from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Modal from './component/Modal';
import SheetPage from './component/Sheet';
import { Sheet } from '@daml.js/daml-project';
import assertid from './helpers/assert_id';
import { key } from './helpers/sheet';
import Button from './form/Button';
import { map, of } from 'rxjs';
import { lbind } from './helpers/BiFunctor$';
import { getMaster } from './helpers/party';

export const main$ = of('master').pipe(
  getLedger,
  getMaster,
  lbind((_, m) =>
    of(m.identifier).pipe(
      getLedger,
      map(([l]) => l),
    ),
  ),
);

const App: FC = () => {
  const store = useStore();
  const { set, owner, master, ledger } = store;

  const main = use$(main$);

  console.log(store);

  useEffect(() => {
    if (!main) return;
    const [l, m] = main;

    set({ master: m, ledger: l });
  }, [main]);

  useEffect(() => {
    if (!ledger || !owner || !master) return;

    const name = 'nice';
    const skey = key(
      master.identifier,
      name,
      owner.identifier,
    );

    ledger
      .fetchByKey(Sheet.Sheet, skey)
      .then((s) => s?.payload)
      .then(assertid())
      .then((sheet) => set({ sheet }))
      .catch(() =>
        console.warn('No sheet found for', name),
      );
  }, [ledger, owner, master]);

  if (!master || !ledger) return <>LOADING... App.tsx</>;

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
          <Button
            onClick={async () => {
              // const sheet = await randomSheetTemplate();
              // const partyName = slugify(
              //   sheet.name,
              // ).toLocaleLowerCase();
              // // of([ledger, undefined] as const)
              // //   .pipe(
              // //     getParty(partyName),
              // //     // createSheet(master.identifier, partyName, sheet),
              // //   )
              // //   .subscribe(console.log);
            }}
          >
            Find new foe
          </Button>

          <SheetPage />
        </>
      )}

      {isLogged && !hasSheet && <CreateSheet />}
    </section>
  );
};

export default App;
