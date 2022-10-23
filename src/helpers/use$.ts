import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

const use$ = <T, _>($?: Observable<T>) => {
  const [s, setS] = useState<T | null>(null);

  useEffect(() => {
    const sub = $?.subscribe(setS);

    return () => sub?.unsubscribe();
  }, []);

  return s;
};

export default use$;
