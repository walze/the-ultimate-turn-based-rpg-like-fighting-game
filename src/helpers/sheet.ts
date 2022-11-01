import {ROLES} from '../config';

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
