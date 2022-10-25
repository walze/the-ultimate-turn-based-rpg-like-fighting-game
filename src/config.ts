import { Weapon } from '@daml.js/daml-project';
import { mergeMap, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { getLedger } from './helpers/ledger';
import { getMaster } from './helpers/party';

const domain = process.env['DOMAIN'] ?? 'localhost';

export const Sword: Weapon.Weapon = {
  name: 'Sword',
  ad: '10',
};

export const Dagger: Weapon.Weapon = {
  name: 'Dagger',
  ad: '5',
};

export enum Party {
  OWNER = 'marcus',
  MASTER = 'master',
  GOBLIN = 'goblin',
}

export const BASE_HEALTH = 8;
export const WEAPONS = [Sword, Dagger];

export const getToken = (party: string) => {
  const data = {
    'https://daml.com/ledger-api': {
      ledgerId: 'sandbox',
      applicationId: process.env['APPLICATION_ID'] ?? 'daml-project',
      actAs: [party],
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
