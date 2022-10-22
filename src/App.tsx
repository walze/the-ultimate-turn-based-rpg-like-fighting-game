import Ledger, { UserRightHelper } from '@daml/ledger';
import { FC } from 'react';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtcHJvamVjdCIsImFjdEFzIjpbIkFsaWNlIl19fQ.UXOO1261wy-XvKLZDPV-MjEKBdmDSNK9K0qcQnaC5LA';

const ledger = new Ledger({
  token,
  wsBaseUrl: 'ws://localhost:6865/',
  httpBaseUrl: 'http://localhost:3000/http://localhost:7575/',
  multiplexQueryStreams: true,
});

export const master = await ledger
  .allocateParty({
    displayName: 'Master',
    identifierHint: 'Master',
  })
  .then(console.log)
  .catch(console.warn);

const App: FC = () => {
  return <div>nice</div>;
};

export default App;
