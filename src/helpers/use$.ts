import { useState, useEffect, useMemo } from 'react';
import {
  catchError,
  map,
  Observable,
  of,
  OperatorFunction,
} from 'rxjs';
import assert_id from './assert_id';

const use$ = <T>($: Observable<T>) => {
  const [s, setS] = useState<T | null>(null);

  useEffect(() => {
    const sub = $?.subscribe(setS);

    return () => sub?.unsubscribe();
  }, [$]);

  return s;
};

export const useNullable$ = <
  T,
  O extends OperatorFunction<NonNullable<T>, any>,
>(
  t: T,
  o: O,
) => {
  const cb = useMemo(
    () =>
      of(t).pipe(
        map((t) => assert_id('no t')(t)),
        o,
        catchError(() => of(null)),
      ),
    [t, o],
  );

  return use$(cb);
};

export default use$;
