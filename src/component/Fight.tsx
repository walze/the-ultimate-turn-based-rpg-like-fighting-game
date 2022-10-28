import Ledger from '@daml/ledger';
import {useEffect} from 'react';
import {lastValueFrom, map, tap} from 'rxjs';
import slugify from 'slugify';
import Button from '../form/Button';
import {pure, rmap, snd$} from '../helpers/BiFunctor$';
import {
  randomSheetTemplate,
  key,
  isKeyValid,
  deleteSheet,
} from '../helpers/sheet';
import {useStore} from '../helpers/store';
import {findOrCreate} from '../helpers/user';
import Loading from './Loading';
import Sheet from './Sheet';

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

const Fight = () => {
  const store = useStore();
  const {ledger, party, set, master} = store;

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
        <Button className="w-1/2">Attack</Button>
        <Button className="w-1/2">Defend</Button>
      </div>

      <Button
        className="bg-red-600"
        onClick={() => {
          const skey = key(
            party.master || '',
            store.ownerSheet?.name || '',
            party.owner || '',
          );

          if (!ledger || !isKeyValid(skey)) return;

          pure(ledger, skey)
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
        Suicide 💀
      </Button>
    </section>
  );
};

export default Fight;
