import Ledger, { UserRightHelper } from '@daml/ledger';
import { FC } from 'react';
import { token } from './config';

token('Alice').then(async (token) => {
  const ledger = new Ledger({
    token,
    wsBaseUrl: 'ws://localhost:6865/',
    httpBaseUrl: 'http://localhost:7575/',
  });

  const master = await ledger.allocateParty({
    displayName: 'Master',
    identifierHint: 'Master',
  });

  console.log(master);
});

const App: FC = () => {
  return <div>nice</div>;
};

export default App;
