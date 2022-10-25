import assert from 'assert';

export class AssertionError<T> extends Error {
  constructor(message: string, public data: T) {
    super(message);
    this.name = 'AssertionError';
  }
}

export default (m?: any) =>
  <T>(t: T) => {
    const err =
      typeof m === 'string'
        ? new AssertionError(m, t)
        : new AssertionError('Assertion failed', m);

    assert(t, err);

    return t;
  };
