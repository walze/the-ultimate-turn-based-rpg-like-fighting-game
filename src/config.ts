import {Role} from '@daml.js/daml-project';
import {mergeMap} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';

const domain = 'localhost';
export const BASE_MODIFIER = 50;

export const makeRole = (
  weapon: string,
  ad: number,
  dr: number,
  hp: number,
): Role.Role => ({
  weapon,
  ad: `${BASE_MODIFIER / ad}`,
  dr: `${BASE_MODIFIER / dr}`,
  hp: `${BASE_MODIFIER / hp}`,
});

export const Sword = makeRole('Sword', 10, 10, 1);
export const Dagger = makeRole('Dagger', 6, 4, 1);

export const ROLES = [Sword, Dagger];

export const getToken = (party: string[]) => {
  const data = {
    'https://daml.com/ledger-api': {
      ledgerId: 'sandbox',
      applicationId: 'daml-project',
      actAs: party,
    },
  };

  return fromFetch(`http://${domain}:3000/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).pipe(mergeMap((r) => r.text()));
};
