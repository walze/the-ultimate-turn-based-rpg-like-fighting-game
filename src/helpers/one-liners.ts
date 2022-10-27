import { tap } from 'rxjs';

export const array = <T>(a: T | T[]): T[] =>
  Array.isArray(a) ? a : [a];

export const log$ = <T>(k?: keyof Console) =>
  // @ts-expect-error yes
  tap((p: T) => console[k || 'log'](p));
