import Ledger from '@daml/ledger';
import { FC } from 'react';
import { getToken } from './config';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtcHJvamVjdCIsImFjdEFzIjpbIm1hc3RlciJdfX0.eggX2PV1DxLgpRVImblcwDVVscxxNA8YWVR3c4vof0A';

getToken('Master').then(console.log);

const ledger = new Ledger({
  token,
  wsBaseUrl: 'ws://localhost:6865/',
  httpBaseUrl: 'http://localhost:3000/',
});

export const master = ledger
  .allocateParty({
    displayName: 'Master',
    identifierHint: 'Master',
  })
  .catch(() => ledger.listUsers())
  .then(console.log);

const App: FC = () => {
  return <div>nice</div>;
};

export default App;
