import Ledger from '@daml/ledger';
import { map, pipe } from 'rxjs';
import { getToken } from '../config';
import { lbind, lmap, pair } from './BiFunctor$';

const host = window.location.host;

export const getLedger = pipe(
  map((p: string) => pair(p, p)),
  lbind((p) => getToken(p)),
  lmap(
    (token) =>
      new Ledger({
        token,
        wsBaseUrl: `ws://${host}/ws/`,
        httpBaseUrl: `http://${host}/api/`,
      }),
  ),
);
