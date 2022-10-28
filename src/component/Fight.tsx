import Ledger from '@daml/ledger';
import {Sheet as DamlSheet} from '@daml.js/daml-project';
import {useEffect} from 'react';
import {lastValueFrom, map, pipe, tap} from 'rxjs';
import slugify from 'slugify';
import Button from '../form/Button';
import {pure, rbind, rmap, snd$} from '../helpers/BiFunctor$';
import {
  randomSheetTemplate,
  key,
  isKeyValid,
  deleteSheet,
  changeStance,
} from '../helpers/sheet';
import {useStore} from '../helpers/store';
import {findOrCreate} from '../helpers/user';
import Loading from './Loading';
import Sheet from './Sheet';
import {assert_id$} from '../helpers/assert_id';
import {
  EyeDropperIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/20/solid';
import {extractExertion} from '../helpers/extractExertion';

const getFoe = async (ledger: Ledger, master: string) => {
  const sheet = await randomSheetTemplate();
  const pName = slugify(sheet.name).toLocaleLowerCase();

  const ob = pure(ledger, pName).pipe(
    findOrCreate,
    rmap((p) => p.identifier),
    snd$,
    map((p) => ({
      ...sheet,
      owner: p,
      master,
    })),
  );

  return lastValueFrom(ob);
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
  const {ledger, party, set, master} = store;

  const oKey = key(
    party.master || '',
    store.ownerSheet?.name || '',
    party.owner || '',
  );

  useEffect(() => {
    if (!ledger || !master) return;

    getFoe(ledger, master).then((foeSheet) => {
      set({
        foeSheet,
        party: {...party, foe: foeSheet.owner},
      });
    });
  }, [ledger, master]);

  if (!ledger) return <Loading />;

  return (
    <section className="flex flex-col gap-4">
      <Sheet sheet={store.foeSheet} />

      <Sheet sheet={store.ownerSheet} />

      <div className="flex gap-4">
        <Button
          className="w-1/2"
          onClick={async () => {
            const id = await ledger
              .fetchByKey(DamlSheet.Sheet, oKey)
              .then((a) => a?.contractId);

            if (!id) return;

            pure(ledger, oKey)
              .pipe(change('Attack'))
              .subscribe((ownerSheet) => set({ownerSheet}));
          }}
        >
          <EyeDropperIcon className="w-4 mr-2" />
          Attack
        </Button>

        <Button
          className="w-1/2"
          onClick={async () => {
            const id = await ledger
              .fetchByKey(DamlSheet.Sheet, oKey)
              .then((a) => a?.contractId);

            if (!id) return;

            pure(ledger, oKey)
              .pipe(change('Defence'))
              .subscribe((ownerSheet) => set({ownerSheet}));
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
