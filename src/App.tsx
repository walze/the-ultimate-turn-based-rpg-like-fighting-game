import Ledger from '@daml/ledger';
import { FC, useEffect, useState } from 'react';
import { from, map, Observable } from 'rxjs';
import { getToken } from './config';
import useWhyChanged from './hooks/useWhyChanged';

const getLedger = (to: string) =>
  getToken(to).pipe(
    map(
      (token) =>
        new Ledger({
          token,
          wsBaseUrl: 'ws://localhost:6865/',
          httpBaseUrl: 'http://localhost:3000/',
        }),
    ),
  );

const use$ = <T, _>($: Observable<T>) => {
  const [s, setS] = useState<T | null>(null);

  useEffect(() => {
    const sub = $.subscribe(setS);

    return () => sub.unsubscribe();
  }, []);

  return s;
};

const useP = <T, _>(p: Promise<T> | undefined) =>
  use$(from(p instanceof Promise ? p : Promise.resolve(p)));

const App: FC = () => {
  const ledger = use$(getLedger('Master'));
  const masterP = ledger
    ?.allocateParty({
      displayName: 'Master',
      identifierHint: 'Master',
    })
    .catch(() => ledger.getParties(['Master']));

  const master = useP(masterP);

  console.log(master);

  return <div>nice</div>;
};

//@ts-ignore
App.whyDidYouRender = true;

export default App;
