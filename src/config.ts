import {mergeMap} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';

const domain = 'localhost';
export const BASE_MODIFIER = 100;

export const makeRole = (
  weapon: string,
  ad: number,
  dr: number,
  hp: number,
): Role => ({
  weapon,
  ad: +(BASE_MODIFIER / ad).toFixed(0),
  dr: +((BASE_MODIFIER / ad) * dr).toFixed(0),
  hp: +(BASE_MODIFIER / hp).toFixed(0),
});

export const Sword = makeRole('Sword', 10, 0.5, 1);
export const Dagger = makeRole('Dagger', 7, 0.1, 1);

export const ROLES = [Sword, Dagger];

console.table(ROLES);

export const getToken = (actAs: string[]) => {
  const data = {
    'https://daml.com/ledger-api': {
      ledgerId: 'sandbox',
      applicationId: 'daml-project',
      actAs,
      readAs: actAs,
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
