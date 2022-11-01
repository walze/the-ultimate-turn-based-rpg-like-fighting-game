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

const Sword = makeRole('Sword', 10, 0.5, 1);
const Dagger = makeRole('Dagger', 7, 0.1, 0.5);
const Spear = makeRole('Spear', 5, 0.1, 1);
const Bow = makeRole('Bow', 3, 0.1, 1);
const Staff = makeRole('Staff', 1, 0.1, 1);
const Shield = makeRole('Shield', 1, 0.1, 1);

export const ROLES = [Sword, Dagger, Spear, Bow, Staff, Shield];

console.table(ROLES);
