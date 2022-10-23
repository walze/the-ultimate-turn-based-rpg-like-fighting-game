import assert from 'assert';
import { map } from 'rxjs';

export const array = <T>(a: T | T[]): T[] =>
  Array.isArray(a) ? a : [a];

export const assert$ = (m?: string | Error) =>
  map(<T>(p: T) => {
    assert(p, m);

    return p;
  });
