import assert from 'assert';
import {map, of} from 'rxjs';

export class AssertionError<T> extends Error {
  constructor(message: string, public data: T) {
    super(message);
    this.name = 'AssertionError';
  }
}

const assert_id =
  (m?: any) =>
  <T>(t: T) => {
    const err =
      typeof m === 'string'
        ? new AssertionError(m, t)
        : new AssertionError('Assertion failed', m);

    assert(t, err);

    return t;
  };

// same as assert_id but returns and Observable
export const assert_id$ =
  (m?: any) =>
  <T>(t: T) =>
    of(assert_id(m)(t));

export const assert$ = (s?: string) => map(assert_id(s));

export default assert_id;
