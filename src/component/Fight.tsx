import Button from '../form/Button';
import {useStore} from '../helpers/store';
import Sheet from './Sheet';
import {
  EyeDropperIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/20/solid';
import {useEffect} from 'react';
import {map, mergeMap, pipe} from 'rxjs';
import {getName} from '../helpers/name-api';
import {makeSheet, randomWeapon} from '../helpers/sheet';
import use$ from '../helpers/use$';

const getFoe = getName().pipe(
  map((name) => makeSheet(name, randomWeapon().weapon)),
);

const Fight = () => {
  const store = useStore();
  const foe = use$(() => getFoe, []);

  useEffect(() => {
    if (foe)
      store.set({
        foe,
      });
  }, [foe]);

  return (
    <section className="flex flex-col gap-4">
      <Sheet sheet={store.foe} />

      <Sheet sheet={store.player} />

      <div className="flex gap-4">
        <Button className="w-1/2" onClick={console.log}>
          <EyeDropperIcon className="w-4 mr-2" />
          Attack
        </Button>

        <Button className="w-1/2" onClick={console.log}>
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
