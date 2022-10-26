import { useState, useEffect, useMemo } from 'react';
import { Observable } from 'rxjs';

const use$ = <T>(f: () => Observable<T>, deps: any[]) => {
  const [s, ss] = useState<T | null>(null);
  const $ = useMemo(() => f(), deps);

  useEffect(() => {
    const sub = $?.subscribe(ss);

    return () => sub?.unsubscribe();
  }, [$]);

  return s;
};

export default use$;
