import {useState, useEffect, useMemo} from 'react';
import {Observable, of} from 'rxjs';

const use$ = <T>(
  f: () => T | Observable<T>,
  deps: unknown[],
) => {
  const [s, ss] = useState<T | null>(null);
  const $ = useMemo(() => f(), deps);

  useEffect(() => {
    const o = $ instanceof Observable ? $ : of($);
    const sub = o.subscribe(ss);

    return () => sub?.unsubscribe();
  }, [$]);

  return s;
};

export default use$;
