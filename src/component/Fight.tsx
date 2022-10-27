import { tap } from 'rxjs';
import slugify from 'slugify';
import Button from '../form/Button';
import { pure, rmap, snd$ } from '../helpers/BiFunctor$';
import {
  randomSheetTemplate,
  key,
  isKeyValid,
  deleteSheet,
} from '../helpers/sheet';
import { useStore } from '../helpers/store';
import { findOrCreate } from '../helpers/user';
import Loading from './Loading';
import Sheet from './Sheet';

const Fight = () => {
  const store = useStore();
  const { ledger, party, set, master } = store;

  if (!ledger) return <Loading />;

  return (
    <>
      {!store.foeSheet?.owner && (
        <Button
          onClick={async () => {
            const sheet = await randomSheetTemplate();
            const pName = slugify(
              sheet.name,
            ).toLocaleLowerCase();

            pure(ledger, pName)
              .pipe(
                findOrCreate,
                rmap((p) => p.identifier),
                snd$,
              )
              .subscribe((p) => {
                set({
                  foeSheet: {
                    ...sheet,
                    owner: p,
                    master,
                  },
                  party: { ...party, foe: p },
                });
              });
          }}
        >
          Find new foe
        </Button>
      )}

      <Sheet sheet={store.foeSheet} />

      <Sheet sheet={store.ownerSheet} />

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
                set({ ownerSheet: undefined });
                window.location.replace('/');
              }),
            )
            .subscribe(console.warn);
        }}
      >
        Suicide 💀
      </Button>
    </>
  );
};

export default Fight;
