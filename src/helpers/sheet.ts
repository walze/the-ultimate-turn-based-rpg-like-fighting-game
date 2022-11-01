import {map, tap} from 'rxjs';
import {ROLES} from '../config';
import {getName} from './name-api';

export const randomWeapon = () =>
  ROLES[Math.floor(Math.random() * ROLES.length)]!;

export const makeSheet = (name: string, weapon: string) => {
  const role = ROLES.find((r) => r.weapon === weapon);

  return {
    name,
    role,
    hp: role?.hp,
    stance: 'Defence',
  } as CharacterSheet;
};

export const getFoe = getName().pipe(
  map((name) => makeSheet(name, randomWeapon().weapon)),
  tap((f) => localStorage.setItem('foe', JSON.stringify(f))),
);
