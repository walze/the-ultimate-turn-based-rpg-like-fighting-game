import { useState, useEffect, useMemo } from 'react';
import { catchError, Observable, of, OperatorFunction } from 'rxjs';
import { assert$ } from './one-liners';

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
        assert$(),
        o,
        catchError(() => of(null)),
      ),
    [t, o],
  );

  return use$(cb);
};

export default use$;
