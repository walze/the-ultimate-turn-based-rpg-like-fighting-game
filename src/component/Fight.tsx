import Ledger from '@daml/ledger';
import {Sheet as DamlSheet} from '@daml.js/daml-project';
import {useEffect} from 'react';
import {catchError, map, mergeMap, of, pipe, tap} from 'rxjs';
import slugify from 'slugify';
import Button from '../form/Button';
import {
  bind,
  fmap,
  lbind,
  lmap,
  pure,
  rbind,
  rmap,
  snd$,
} from '../helpers/BiFunctor$';
import {
  randomSheetTemplate,
  key,
  isKeyValid,
  deleteSheet,
  changeStance,
  createSheet,
  findSheet,
} from '../helpers/sheet';
import {State, StateFN, useStore} from '../helpers/store';
import {findOrCreate} from '../helpers/user';
import Loading from './Loading';
import Sheet from './Sheet';
import {assert$, assert_id$} from '../helpers/assert_id';
import {
  EyeDropperIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/20/solid';
import {extractCreatedExertion} from '../helpers/extractExertion';
import {getName} from '../helpers/name-api';
import use$ from '../helpers/use$';
import {Stance} from '@daml.js/daml-project-1.0.0/lib/Sheet';
import {suffer} from '../helpers/action';
import {ContractId} from '@daml/types';

const slug = (s = '') => slugify(s).toLowerCase();

const getFoe = (name: string, l: Ledger, master: string) => {
  const createFoe = (name: string) =>
    pipe(
      rmap(slug),
      findOrCreate,
      rmap((p) => p.identifier),
      createSheet(master, randomSheetTemplate(name)),
      snd$,
    );

  return pure(l, slug(name)).pipe(
    findOrCreate,
    rmap((p) => key(master, name, p.identifier)),
    findSheet,
    assert$('Failed to find foe'),
    catchError(() =>
      pure(l, name).pipe(
        createFoe(name),
        snd$,
        map((a) => a.payload),
      ),
    ),
    // assert$('get foe failed'),
  );
};

const actionPipe = (
  action: Stance,
  target: ContractId<DamlSheet.Sheet>,
  turnName: 'ownerSheet' | 'foeSheet',
) => {
  const changes: Partial<State> = {};
  const notTurn =
    turnName === 'foeSheet' ? 'ownerSheet' : 'foeSheet';

  return pipe(
    rbind((k: DamlSheet.Sheet.Key, l: Ledger) =>
      l.fetchByKey(DamlSheet.Sheet, k),
    ),
    rbind(assert_id$('Sheet not found')),
    rbind((e, l) =>
      pure(e.contractId, e.payload).pipe(
        lbind((cid) =>
          pure(l, cid).pipe(
            changeStance(action),
            snd$,
            tap((e) => (changes[turnName] = e.payload)),
          ),
        ),
        mergeMap(([e]) =>
          pure(l, e.payload).pipe(
            suffer(target),
            snd$,
            tap((e) => (changes[notTurn] = e.payload)),
          ),
        ),
      ),
    ),

    map(() => changes),
  );
};

const Fight = () => {
  const store = useStore();
  const {ledger, party, set, turn} = store;

  const oKey = key(
    party.master || '',
    store.ownerSheet?.name || '',
    party.owner || '',
  );

  const foKey = key(
    party.master || '',
    store.foeSheet?.name || '',
    party.foe || '',
  );

  const foe = use$(() => {
    const cached = localStorage.getItem('current_foe');
    if (cached) return of(cached);

    return getName().pipe(
      tap((name) => localStorage.setItem('current_foe', name)),
    );
  }, []);

  const foeSheet = use$(() => {
    return ledger && party.foe && foe
      ? getFoe(foe, ledger, party.master || '')
      : of(null);
  }, [ledger, foe, party.foe]);

  const turnKey = turn ? oKey : foKey;
  const coTurnKey = !turn ? oKey : foKey;
  const turnSheetName = turn ? 'ownerSheet' : 'foeSheet';

  useEffect(() => {
    foe && set({foe: slug(foe)});
    foeSheet && set({foeSheet: foeSheet});
  }, [foeSheet, foe]);

  if (!ledger) return <Loading />;

  const turnAction = (action: Stance) => async () => {
    const id = await ledger.fetchByKey(
      DamlSheet.Sheet,
      coTurnKey,
    );

    if (!id) return;

    pure(ledger, turnKey)
      .pipe(actionPipe(action, id.contractId, turnSheetName))
      .subscribe((changes) => set({turn: !turn, ...changes}));
  };

  return (
    <section className="flex flex-col gap-4">
      <Sheet sheet={store.foeSheet} />

      <Sheet sheet={store.ownerSheet} />

      <div className="flex gap-4">
        <Button className="w-1/2" onClick={turnAction('Attack')}>
          <EyeDropperIcon className="w-4 mr-2" />
          Attack
        </Button>

        <Button
          className="w-1/2"
          onClick={turnAction('Defence')}
        >
          <ShieldExclamationIcon className="w-4 mr-2" />
          Defend
        </Button>
      </div>

      <Button
        className="bg-red-600"
        onClick={() => {
          if (!ledger || !isKeyValid(oKey)) return;

          pure(ledger, oKey)
            .pipe(
              deleteSheet,
              tap(() => {
                set({ownerSheet: undefined});
                window.location.replace('/');
              }),
            )
            .subscribe(console.warn);
        }}
      >
        💀 Suicide
      </Button>
    </section>
  );
};

export default Fight;
