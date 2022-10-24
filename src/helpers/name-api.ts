import { map, mergeAll, mergeMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export const getName = () =>
  fromFetch(`/name/1?nameOptions=funnyWords`).pipe(
    mergeMap((r) => r.json() as Promise<string[]>),
    mergeAll(),
    map((a) => a.replace(/_/g, ' ')),
  );
