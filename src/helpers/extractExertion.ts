import Ledger, {Event} from '@daml/ledger';
import {ContractId} from '@daml/types';
import assert from 'assert';
import {pipe, map, mergeMap} from 'rxjs';
import {assert_id$} from './assert_id';
import {Pair, snd$} from './BiFunctor$';

type Exertion<T extends object> = Pair<
  Ledger,
  [ContractId<T>, Event<T>[]]
>;

export const extractExertion = pipe(
  <M extends object>(a: Exertion<M>) => snd$(a),
  snd$,
  map((d) => d[1]),
  mergeMap(assert_id$()),
  map((a) => {
    assert('created' in a, 'not created but archived');

    return a.created.payload;
  }),
);
