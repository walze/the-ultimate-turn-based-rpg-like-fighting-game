import assert from 'assert';
import { map, tap } from 'rxjs';

export const array = <T>(a: T | T[]): T[] =>
  Array.isArray(a) ? a : [a];

export const assert$ = <T>(m?: string | Error) =>
  map((p: T) => {
    assert(p, m);

    return p as NonNullable<T>;
  });

export const log$ = <T>(k?: keyof Console) =>
  // @ts-ignore
  tap((p: T) => console[k || 'log'](p));
