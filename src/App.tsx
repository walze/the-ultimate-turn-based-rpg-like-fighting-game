import {FC, useEffect} from 'react';
import {useStore} from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Fight from './component/Fight';
import Modal from './component/Modal';
import {getFoe} from './helpers/sheet';
import use$ from './helpers/use$';
import {of} from 'rxjs';

const App: FC = () => {
  const store = useStore();

  const hasSheet = store.player?.name;

  const foe = use$(() => {
    const foe = localStorage.getItem('foe');
    if (foe) return of(JSON.parse(foe) as CharacterSheet);

    return getFoe;
  }, []);

  useEffect(() => {
    const player = localStorage.getItem('player');

    if (player) store.set({player: JSON.parse(player)});
    if (foe) store.set({foe});
  }, [foe]);

  return (
    <section className="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="tracking-tight uppercase font-extrabold mt-6 text-center text-3xl text-gray-900">
        The Ultimate Turn-Based RPG Like Fighting Game Deluxe
        Edition
      </h1>

      {hasSheet && <Fight />}

      <Modal show={!hasSheet}>
        <CreateSheet />
      </Modal>
    </section>
  );
};

export default App;
