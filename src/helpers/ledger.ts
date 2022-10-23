import Ledger from '@daml/ledger';
import { map } from 'rxjs';
import { getToken } from '../config';

export const getLedger = (party: string) =>
  getToken(party).pipe(
    map(
      (token) =>
        new Ledger({
          token,
          wsBaseUrl: 'ws://localhost:6865/',
          httpBaseUrl: 'http://localhost:3000/',
        }),
    ),
  );
