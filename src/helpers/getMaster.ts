import Ledger, { UserRightHelper } from '@daml/ledger';
import { mergeMap, of } from 'rxjs';
import { Party } from '../config';
import { setRights, getParty } from './party';

const getMaster = mergeMap((l: Ledger) =>
  of(l).pipe(
    getParty(Party.MASTER),
    setRights(l, [UserRightHelper.participantAdmin]),
  ),
);

export default getMaster;
