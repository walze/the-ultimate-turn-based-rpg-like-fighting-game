import { FC, useEffect, useMemo } from 'react';
import { getLedger, _ledger } from './helpers/ledger';
import use$ from './helpers/use$';
import Login from './component/Login';
import { useStore } from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Modal from './component/Modal';
import SheetPage from './component/Sheet';
import Button from './form/Button';
import { concatMap, from, map, of, pipe, toArray } from 'rxjs';
import { pair$, rbind, snd$ } from './helpers/BiFunctor$';
import Ledger from '@daml/ledger';
import Loading from './component/Loading';
import { findOrCreate } from './helpers/user';
import { key } from './helpers/sheet';
import { Sheet } from '@daml.js/daml-project';
import assert_id from './helpers/assert_id';
import SheetSelect from './component/SheetSelect';

export const getMain = pipe(
  getLedger,
  rbind((ids: string[], l: Ledger) =>
    from(ids).pipe(
      concatMap((id) => findOrCreate(pair$(l, id))),
      snd$,
      map((u) => u.identifier),
      toArray(),
    ),
  ),
  snd$,
  getLedger,
);

const App: FC = () => {
  const store = useStore();

  const uNames = [store.master, store.owner, store.foe];
  const { ledger, party, set } = store;

  const main$ = useMemo(
    () => of(uNames.filter(Boolean) as string[]).pipe(getMain),
    uNames,
  );

  const main = use$(main$) || [];

  console.log(store);

  useEffect(() => {
    const [ledger, parties] = main;
    if (!ledger || !parties) return;

    const [master, owner, foe] = parties;

    store.set({ ledger, party: { master, owner, foe } });
  }, [main]);

  useEffect(() => {
    const name = store.sheet.name;
    if (!ledger || !party.master || !party.owner || !name)
      return;

    const skey = key(party.master, name, party.owner);

    ledger
      .fetchByKey(Sheet.Sheet, skey)
      .then((s) => s?.payload)
      .then(assert_id())
      .then((sheet) => set({ sheet }))
      .catch(() => console.warn('No sheet found for', name));
  }, [ledger, store.sheet.name]);

  const hasSheet = !!store.sheet.name;
  const isLogged = !!store.owner;

  if (!ledger || !party.master) return <Loading />;

  return (
    <section className="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="tracking-tight uppercase font-extrabold mt-6 text-center text-3xl text-gray-900">
        The Ultimate Turn-Based RPG Like Fighting Game
      </h1>

      <Modal show={!store.sheet?.name}>
        <SheetSelect />
      </Modal>

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
