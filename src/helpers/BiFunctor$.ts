import {
  from,
  map,
  concatMap,
  Observable,
  ObservableInput,
  of,
} from 'rxjs';

export const pair = <A, B>(a: A, b: B) =>
  [a, b] as readonly [A, B];

export type Pair<A, B> = Observable<readonly [A, B]>;

export const pure = <A, B>(a: A, b: B) =>
  of(pair(a, b)) as Pair<A, B>;

export type lmap = <A, B, C>(
  f: (a: A, c: C) => B,
) => (p: Pair<A, C>) => Pair<B, C>;

export type rmap = <A, B, C>(
  f: (b: B, a: A) => C,
) => (p: Pair<A, B>) => Pair<A, C>;

export type fmap = <A, B, C, D>(
  f: (a: A, c: C) => readonly [B, D],
) => (p: Pair<A, C>) => Pair<B, D>;

export type bmap = <A, B, C>(
  f: (b: B) => C,
) => (p: Pair<A, B>) => Pair<A, C>;

export type lbind = <A, B, C>(
  f: (a: A, c: C) => ObservableInput<B>,
) => (p: Pair<A, C>) => Pair<B, C>;

export type rbind = <A, B, C>(
  f: (b: B, c: A) => ObservableInput<C>,
) => (p: Pair<A, B>) => Pair<A, C>;

export type bind = <A, B, C, D>(
  f: (b: A, d: B) => Pair<C, D>,
) => (p: Pair<A, B>) => Pair<C, D>;

export type fbind = <A, B, C>(
  f: (a: A, c: C) => ObservableInput<B>,
) => (p: Pair<A, C>) => Pair<B, C>;

export const lmap: lmap = (f) => (p) =>
  p.pipe(map(([a, b]) => pair(f(a, b), b)));
export const rmap: rmap = (f) => (p) =>
  p.pipe(map(([a, b]) => pair(a, f(b, a))));

export const fmap: fmap = (f) => (p) =>
  p.pipe(map(([a, c]) => f(a, c)));

export const bmap: bmap = (f) => (p) =>
  p.pipe(map(([a, b]) => pair(a, f(b))));

export const lbind: lbind = (f) => (p) =>
  p.pipe(
    concatMap(([a, b]) =>
      from(f(a, b)).pipe(map((c) => pair(c, b))),
    ),
  );

export const rbind: rbind = (f) => (p) =>
  p.pipe(
    concatMap(([a, b]) =>
      from(f(b, a)).pipe(map((c) => pair(a, c))),
    ),
  );

export const bind: bind = (f) => (p) =>
  p.pipe(concatMap(([a, b]) => f(a, b)));

export const fbind: fbind = (f) => (p) =>
  p.pipe(
    concatMap(([a, b]) =>
      from(f(a, b)).pipe(map((c) => pair(c, b))),
    ),
  );

export const fst$ = <A, B>(p: Pair<A, B>) =>
  p.pipe(map(([a]) => a));
export const snd$ = <A, B>(p: Pair<A, B>) =>
  p.pipe(map(([, b]) => b));
