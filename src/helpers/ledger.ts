import Ledger from '@daml/ledger';
import { map, mergeMap, pipe } from 'rxjs';
import { getToken } from '../config';

export const getLedger = pipe(
  mergeMap((party: string) => getToken(party)),
  map(
    (token) =>
      new Ledger({
        token,
        wsBaseUrl: 'ws://localhost:6865/',
        httpBaseUrl: 'http://localhost:3000/',
      }),
  ),
);
