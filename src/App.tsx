import Ledger from '@daml/ledger';
import { FC } from 'react';
import { getToken } from './config';

const getLedger = (to: string) =>
  getToken(to).then(
    (token) =>
      new Ledger({
        token,
        wsBaseUrl: 'ws://localhost:6865/',
        httpBaseUrl: 'http://localhost:3000/',
      }),
  );

// export const master = ledger
//   .allocateParty({
//     displayName: 'Master',
//     identifierHint: 'Master',
//   })
//   .catch(() => ledger.listUsers())
//   .then(console.log);

const App: FC = () => {
  return <div>nice</div>;
};

export default App;
