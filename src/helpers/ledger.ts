import Ledger from '@daml/ledger';
import {map, pipe} from 'rxjs';
import {getToken} from '../config';
import {lbind, lmap, pair} from './BiFunctor$';

const host = window.location.host;

export const _ledger = (token = '') =>
  new Ledger({
    token,
    wsBaseUrl: `ws://${host}/ws/`,
    httpBaseUrl: `http://${host}/api/`,
  });

export const getLedger = pipe(
  map((p: string[]) => pair(p, p)),
  lbind(getToken),
  lmap(_ledger),
);
