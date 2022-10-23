import { Sheet } from '@daml.js/daml-project';
import Ledger from '@daml/ledger';
import { mergeMap, of, map, tap } from 'rxjs';
import { getParty } from './party';

export const createSheet = (
  masterID: string,
  partyName: string,
  sheet: Partial<Sheet.Sheet>,
) =>
  mergeMap((l: Ledger) =>
    of(l).pipe(
      getParty(partyName),
      map((party) => ({
        ...sheet,
        master: masterID,
        owner: party.identifier,
      })),
      tap((sheet) => console.log('sheet', sheet)),
      mergeMap((sheet) =>
        l.create(Sheet.Sheet, sheet as Sheet.Sheet),
      ),
    ),
  );
