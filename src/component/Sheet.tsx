import { Sheet } from '@daml.js/daml-project';
import { useEffect } from 'react';
import assert from '../helpers/assert';
import { key } from '../helpers/sheet';
import { useStore } from '../helpers/store';

type StatProps = {
  name: string;
  value: unknown;
};

const Stat = ({ name, value }: StatProps) => (
  <li className="flex w-1/2  items-center mt-4 text-gray-700">
    <h3 className="px-2 text-sm">
      <>
        <span className="text-base font-semibold">{name}: </span>
        {value}
      </>
    </h3>
  </li>
);

export default () => {
  const { sheet } = useStore();

  if (!sheet) return <>Loading...</>;

  const {
    name,
    hp,
    weapon: { ad, name: wname },
  } = sheet;

  return (
    <>
      <article className="w-full mx-auto max-w-lg overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex items-center px-6 py-3 bg-gray-900">
          <h2 className="text-lg font-bold text-white">{name}</h2>
        </div>

        <div className="px-6 py-4 pb-6">
          <ul className="flex flex-col">
            <Stat name="HP" value={hp} />

            <Stat name="Weapon" value={wname} />

            <Stat name="AD" value={ad} />
          </ul>
        </div>
      </article>
    </>
  );
};
