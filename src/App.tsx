import {FC, useEffect} from 'react';
import {getLedger} from './helpers/ledger';
import use$ from './helpers/use$';
import Login from './component/Login';
import {useStore} from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Modal from './component/Modal';
import {concatMap, from, map, of, pipe, toArray} from 'rxjs';
import {pure, rbind, snd$} from './helpers/BiFunctor$';
import Ledger, {UserRightHelper} from '@daml/ledger';
import {findOrCreate} from './helpers/user';
import SheetSelect from './component/SheetSelect';
import Fight from './component/Fight';
import {key} from './helpers/sheet';
import {CharAction} from '@daml.js/daml-project';
import {Party} from '@daml/types';

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

  const {master, owner, foe, set, ownerSheet} = store;
  const uNames = [master, owner, foe];

  const [ledger, parties] =
    use$(
      () => of(uNames.filter(Boolean) as string[]).pipe(getMain),
      [master, owner, foe],
    ) || [];

  useEffect(() => {
    if (!ledger || !parties) return;
    const [master, owner, foe] = parties;

    set({ledger, party: {master, owner, foe}});
  }, [ledger, master, owner, foe]);

  // this should not exist
  useEffect(() => {
    if (!ledger || !parties) return;
    const [master, foe] = parties;
    if (!master || !foe) return;

    ledger
      .grantUserRights(master, [
        UserRightHelper.participantAdmin,
        UserRightHelper.canActAs(foe),
        UserRightHelper.canReadAs(foe),
      ])
      .catch(console.error);
  }, [ledger, parties]);

  const hasSheetName = !!ownerSheet?.name;
  const hasSheetOwner = !!ownerSheet?.owner;
  const isLogged = !!owner;

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

      {isLogged && hasSheetOwner && <Fight />}

      {isLogged && hasSheetName && !hasSheetOwner && (
        <CreateSheet />
      )}
    </section>
  );
};

export default App;
