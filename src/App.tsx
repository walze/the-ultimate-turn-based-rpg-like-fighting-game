import { FC, useEffect, useMemo } from 'react';
import { getLedger, _ledger } from './helpers/ledger';
import use$ from './helpers/use$';
import Login from './component/Login';
import { useStore } from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Modal from './component/Modal';
import SheetPage from './component/Sheet';
import Button from './form/Button';
import {
  concatMap,
  from,
  map,
  of,
  pipe,
  tap,
  toArray,
} from 'rxjs';
import { pure, rbind, snd$ } from './helpers/BiFunctor$';
import Ledger from '@daml/ledger';
import Loading from './component/Loading';
import { findOrCreate } from './helpers/user';
import {
  deleteSheet,
  isKeyValid,
  key,
  randomSheetTemplate,
} from './helpers/sheet';
import SheetSelect from './component/SheetSelect';
import slugify from 'slugify';
import { TrashIcon } from '@heroicons/react/24/solid';

export const getMain = pipe(
  getLedger,
  rbind((ids: string[], l: Ledger) =>
    from(ids).pipe(
      concatMap((id) => findOrCreate(pure(l, id))),
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

  const main =
    use$(
      () => of(uNames.filter(Boolean) as string[]).pipe(getMain),
      uNames,
    ) || [];

  useEffect(() => {
    const [ledger, parties] = main;
    if (!ledger || !parties) return;

    const [master, owner, foe] = parties;

    store.set({ ledger, party: { master, owner, foe } });
  }, [main]);

  const hasSheetName = !!store.sheet.name;
  const hasSheetOwner = !!store.sheet.owner;
  const isLogged = !!store.owner;

  if (!ledger) return <Loading />;

  return (
    <section className="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="tracking-tight uppercase font-extrabold mt-6 text-center text-3xl text-gray-900">
        The Ultimate Turn-Based RPG Like Fighting Game
      </h1>

      <Modal show={isLogged && !hasSheetName}>
        <SheetSelect />
      </Modal>

      <Modal show={!isLogged}>
        <Login />
      </Modal>

      {isLogged && hasSheetOwner && (
        <>
          <Button
            onClick={async () => {
              const sheet = await randomSheetTemplate();
              const pName = slugify(
                sheet.name,
              ).toLocaleLowerCase();

              console.log(pName);

              pure(ledger, pName)
                .pipe(
                  findOrCreate,
                  tap(console.log),
                  // createSheet(master.identifier, partyName, sheet),
                )
                .subscribe(console.log);
            }}
          >
            Find new foe
          </Button>

          <SheetPage />

          <Button
            className="bg-red-600"
            onClick={() => {
              const skey = key(
                party.master || '',
                store.sheet.name || '',
                party.owner || '',
              );

              if (!ledger || !isKeyValid(skey)) return;

              pure(ledger, skey)
                .pipe(
                  tap(console.log),
                  deleteSheet,
                  tap(console.log),
                  tap(() => {
                    set({ sheet: {} });
                    window.location.replace('/');
                  }),
                )
                .subscribe(console.warn);
            }}
          >
            Delete Sheet
            <TrashIcon
              className="ml-2 -mr-0.5 h-4 w-4"
              aria-hidden="true"
            />
          </Button>
        </>
      )}

      {isLogged && hasSheetName && !hasSheetOwner && (
        <CreateSheet />
      )}
    </section>
  );
};

export default App;
