import Ledger from '@daml/ledger';
import { map } from 'rxjs';
import { getToken } from '../config';

export const getLedger = (to: string) =>
  getToken(to).pipe(
    map(
      (token) =>
        new Ledger({
          token,
          wsBaseUrl: 'ws://localhost:6865/',
          httpBaseUrl: 'http://localhost:3000/',
        }),
    ),
  );
