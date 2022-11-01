import {
  EyeDropperIcon,
  HeartIcon,
  PlayIcon,
  Squares2X2Icon,
} from '@heroicons/react/20/solid';
import {capitalize} from 'lodash';
import {ReactNode} from 'react';
import {useStore} from '../helpers/store';
import Loading from './Loading';

type StatProps = {
  children: ReactNode[];
};

const Stat = ({children: [icon, stat, value]}: StatProps) => (
  <li className="flex w-1/2  items-center mt-2.5 text-gray-700">
    <h3 className="flex items-center px-2 text-sm">
      {icon} <span className="font-extrabold">{stat}</span>
      <span className="mx-1 text-gray-300">-</span>
      {value}
    </h3>
  </li>
);

type Props = {
  sheet?: CharacterSheet;
};

const Sheet = (props: Props) => {
  const store = useStore();
  const turnSheet = store.turn ? store.player : store.foe;

  const {sheet} = props;

  if (!sheet) return <Loading label="sheet" />;

  const {
    name,
    hp,
    role: {weapon},
    stance,
  } = sheet;

  const thisTurn = turnSheet?.name === name;

  return (
    <article className="w-full mx-auto max-w-lg overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="flex items-center px-6 py-3 bg-gray-900">
        <h2
          className={css(
            'text-lg text-white',
            thisTurn ? 'font-extrabold' : 'font-semibold',
          )}
        >
          {thisTurn && (
            <PlayIcon className="inline w-4 mr-1 -mt-0.5" />
          )}
          {capitalize(name)}
          {thisTurn && (
            <PlayIcon className="inline w-4 ml-1 -mt-0.5 rotate-180" />
          )}
        </h2>
      </div>

      <div className="px-6 py-3.5 pb-6">
        <ul className="flex flex-col justify-center">
          <Stat>
            <HeartIcon className="w-4 h-4 mr-1" />
            HP
            {`${hp}`}
          </Stat>

          <Stat>
            <EyeDropperIcon className="w-4 h-4 mr-1" />
            Weapon
            {weapon}
          </Stat>

          <Stat>
            <Squares2X2Icon className="w-4 h-4 mr-1" />
            Stance
            {stance}
          </Stat>
        </ul>
      </div>
    </article>
  );
};

export default Sheet;
