import assert from 'assert';
import { map } from 'rxjs';

export const array = <T>(a: T | T[]): T[] =>
  Array.isArray(a) ? a : [a];

export const assert$ = <T>(m?: string | Error) =>
  map((p: T) => {
    assert(p, m);

    return p as NonNullable<T>;
  });
