import Ledger from '@daml/ledger';
import { map, mergeMap, pipe } from 'rxjs';
import { getToken } from '../config';

const host = window.location.host;

export const getLedger = pipe(
  mergeMap((party: string) => getToken(party)),
  map(
    (token) =>
      new Ledger({
        token,
        wsBaseUrl: `ws://${host}/ws/`,
        httpBaseUrl: `http://${host}/api/`,
      }),
  ),
);
