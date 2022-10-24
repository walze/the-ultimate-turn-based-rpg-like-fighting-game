import assert from 'assert';

export default <T>(t: T, m?: string | Error) => {
  assert(t, m);

  return t;
};
