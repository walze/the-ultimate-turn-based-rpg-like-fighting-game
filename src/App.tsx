import {FC} from 'react';
import {useStore} from './helpers/store';
import CreateSheet from './component/CreateSheet';
import Fight from './component/Fight';
import Modal from './component/Modal';

const App: FC = () => {
  const store = useStore();

  const hasSheet = store.player?.name;

  return (
    <section className="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="tracking-tight uppercase font-extrabold mt-6 text-center text-3xl text-gray-900">
        The Ultimate Turn-Based RPG Like Fighting Game
      </h1>

      {hasSheet && <Fight />}

      <Modal show={!hasSheet}>
        <CreateSheet />
      </Modal>
    </section>
  );
};

export default App;
