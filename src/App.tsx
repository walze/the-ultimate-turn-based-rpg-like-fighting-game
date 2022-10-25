import { FC, useEffect, useMemo } from 'react';
import { getLedger, _ledger } from './helpers/ledger';
import use$ from './helpers/use$';
import Login from './component/Login';
import { useStore } from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Modal from './component/Modal';
import SheetPage from './component/Sheet';
import Button from './form/Button';
import { from, map, of, pipe, tap } from 'rxjs';
import { rbind } from './helpers/BiFunctor$';
import Ledger, { User } from '@daml/ledger';

const intersectUsers = (ids: string[]) =>
  pipe(
    map((users: User[]) =>
      users.filter((user) =>
        ids.some((id) => user.primaryParty?.includes(id)),
      ),
    ),
  );

export const getMain = pipe(
  getLedger,
  rbind((ps, l) =>
    from(l.listUsers()).pipe(
      intersectUsers(ps),
      map((us) => us.map((u) => u.primaryParty!)),
      getLedger,
      map((ab) => ab[1]),
    ),
  ),
  rbind((ids: string[], l: Ledger) =>
    from(l.listUsers()).pipe(intersectUsers(ids)),
  ),
);

const App: FC = () => {
  const store = useStore();
  const { ledger, names: uNames } = store;

  const main$ = useMemo(
    () => of(uNames.filter(Boolean) as string[]).pipe(getMain),
    uNames,
  );
  const main = use$(main$) || [];

  const isLogged = !!store.owner;

  useEffect(() => {
    const [ledger, parties] = main;
    if (!ledger || !parties) return;

    store.set({ ledger, parties });
  }, [main]);

  // useEffect(() => {
  //   if (!ledger || !owner || !master) return;

  //   const name = 'nice';
  //   const skey = key(master, name, owner.identifier);

  //   ledger
  //     .fetchByKey(Sheet.Sheet, skey)
  //     .then((s) => s?.payload)
  //     .then(assertid())
  //     .then((sheet) => set({ sheet }))
  //     .catch(() => console.warn('No sheet found for', name));
  // }, [ledger, owner, master]);

  if (!ledger) return <>LOADING... App.tsx</>;

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
