import Ledger from '@daml/ledger';
import {Sheet as DamlSheet} from '@daml.js/daml-project';
import {useEffect} from 'react';
import {lastValueFrom, map, mergeMap, of, pipe, tap} from 'rxjs';
import slugify from 'slugify';
import Button from '../form/Button';
import {pure, rbind, rmap, snd$} from '../helpers/BiFunctor$';
import {
  randomSheetTemplate,
  key,
  isKeyValid,
  deleteSheet,
  changeStance,
  createSheet,
  findSheet,
} from '../helpers/sheet';
import {useStore} from '../helpers/store';
import {findOrCreate} from '../helpers/user';
import Loading from './Loading';
import Sheet from './Sheet';
import {assert$, assert_id$} from '../helpers/assert_id';
import {
  EyeDropperIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/20/solid';
import {extractExertion} from '../helpers/extractExertion';
import {getName} from '../helpers/name-api';
import use$ from '../helpers/use$';

const getFoe = (l: Ledger, master: string) => {
  const cached = localStorage.getItem('current_foe');
  const slug = (s = '') => slugify(s).toLowerCase();

  console.log(l);

  const sheet$ = cached
    ? pure(l, key(master, cached, slug(cached))).pipe(findSheet)
    : pure(l, undefined).pipe(
        rbind(getName),
        rbind((n, l) =>
          pure(l, n).pipe(
            rmap(slug),
            findOrCreate,
            snd$,
            map((p) => p.identifier),
          ),
        ),
        createSheet(master, randomSheetTemplate('whatever')),
        snd$,
      );

  return sheet$.pipe(assert$('Failed to get foe'));
};

const change = (stance: DamlSheet.Stance) =>
  pipe(
    rbind((k: DamlSheet.Sheet.Key, l: Ledger) =>
      l
        .fetchByKey(DamlSheet.Sheet, k)
        .then((a) => a?.contractId),
    ),
    rbind(assert_id$('Sheet not found')),
    changeStance(stance),
    extractExertion,
  );

const Fight = () => {
  const store = useStore();
  const {ledger, party, set, master, turn} = store;

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

  const foeSheet = use$(
    () => (ledger ? getFoe(ledger, master) : of(null)),
    [master],
  );

  console.log(foeSheet);

  const turnKey = turn ? oKey : foKey;
  const turnSheet = turn ? store.ownerSheet : store.foeSheet;
  const turnSheetName = turn ? 'ownerSheet' : 'foeSheet';

  // useEffect(() => {
  //   set({foeSheet: foeSheet ?? undefined});
  // }, [foeSheet]);

  if (!ledger) return <Loading />;

  console.log(foKey);

  return (
    <section className="flex flex-col gap-4">
      <Sheet sheet={store.foeSheet} />

      <Sheet sheet={store.ownerSheet} />

      <div className="flex gap-4">
        <Button
          className="w-1/2"
          onClick={async () => {
            const id = await ledger
              .fetchByKey(DamlSheet.Sheet, turnKey)
              .then((a) => a?.contractId);

            console.warn(id);

            if (!id) return;

            pure(ledger, turnKey)
              .pipe(change('Attack'))
              .subscribe((sheet) => {
                console.log(sheet);

                set({[turnSheetName]: sheet, turn: !turn});
              });
          }}
        >
          <EyeDropperIcon className="w-4 mr-2" />
          Attack
        </Button>

        <Button
          className="w-1/2"
          onClick={async () => {
            const id = await ledger
              .fetchByKey(DamlSheet.Sheet, turnKey)
              .then((a) => a?.contractId);

            if (!id) return;

            pure(ledger, turnKey)
              .pipe(change('Defence'))
              .subscribe((sheet) => {
                console.log(sheet);

                set({[turnSheetName]: sheet, turn: !turn});
              });
          }}
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
              tap(console.log),
              deleteSheet,
              tap(console.log),
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
