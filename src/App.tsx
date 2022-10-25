import slugify from 'slugify';

import { FC, useEffect } from 'react';
import { getLedger } from './helpers/ledger';
import use$, { useNullable$ } from './helpers/use$';
import Login from './component/Login';
import { useStore } from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Modal from './component/Modal';
import SheetPage from './component/Sheet';
import { Sheet } from '@daml.js/daml-project';
import assert from './helpers/assertid';
import {
  createSheet,
  key,
  randomSheetTemplate,
} from './helpers/sheet';
import Button from './form/Button';
import { of } from 'rxjs';
import { getMaster, getParty } from './helpers/party';
import { Party } from './config';

export const ledger$ = of(Party.MASTER).pipe(getLedger);
export const master$ = getMaster(ledger$);

const App: FC = () => {
  const store = useStore();
  console.log(store);

  const { set, owner } = store;

  const [ledger, master] = use$(master$) || [];

  useEffect(() => {
    if (!master || !ledger) return;
    set({ master, ledger });
  }, [master, ledger]);

  useEffect(() => {
    if (!ledger || !owner || !master) return;

    const name = 'Baracus Rexx';
    const skey = key(master.identifier, name, owner.identifier);

    ledger
      .fetchByKey(Sheet.Sheet, skey)
      .then((s) => s?.payload)
      .then(assert)
      .then((sheet) => set({ sheet }))
      .catch(() => console.warn('No sheet found for', name));
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
          <Button
            onClick={async () => {
              const sheet = await randomSheetTemplate();
              const partyName = slugify(
                sheet.name,
              ).toLocaleLowerCase();

              of([ledger, undefined] as const)
                .pipe(
                  getParty(partyName),
                  // createSheet(master.identifier, partyName, sheet),
                )
                .subscribe(console.log);
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
