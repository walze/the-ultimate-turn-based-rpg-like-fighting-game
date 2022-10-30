import Ledger, {Event} from '@daml/ledger';
import {ContractId} from '@daml/types';
import assert from 'assert';
import {Pair, rmap} from './BiFunctor$';

type Exertion<T extends object> = Pair<
  Ledger,
  [ContractId<T>, Event<T>[]]
>;

export const extractCreatedExertion = <M extends object>(
  a: Exertion<M>,
) =>
  a.pipe(
    rmap((ex) => {
      const [, evs] = ex;
      const ev = evs[evs.length - 1];

      assert(ev, 'falsy event');
      assert('created' in ev, 'not created but archived');

      return ev.created;
    }),
  );
