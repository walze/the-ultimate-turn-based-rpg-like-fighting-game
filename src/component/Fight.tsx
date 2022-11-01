import Button from '../form/Button';
import {useStore} from '../helpers/store';
import Sheet from './Sheet';
import {
  EyeDropperIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/20/solid';

const Fight = () => {
  const store = useStore();

  const target = store.turn ? 'foe' : 'player';

  return (
    <section className="flex flex-col gap-4">
      <Sheet sheet={store.foe} />

      <Sheet sheet={store.player} />

      <div className="flex gap-4">
        <Button
          className="w-1/2"
          onClick={() => {
            store.attack(target);
          }}
        >
          <EyeDropperIcon className="w-4 mr-2" />
          Attack
        </Button>

        <Button
          className="w-1/2"
          onClick={() => {
            store.defend(target);
          }}
        >
          <ShieldExclamationIcon className="w-4 mr-2" />
          Defend
        </Button>
      </div>

      <Button
        className="bg-red-600"
        onClick={() => {
          console.log('die');
        }}
      >
        💀 Suicide
      </Button>
    </section>
  );
};

export default Fight;
