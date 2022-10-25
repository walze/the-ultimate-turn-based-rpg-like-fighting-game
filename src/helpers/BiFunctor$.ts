import {
  from,
  map,
  mergeMap,
  Observable,
  ObservableInput,
  of,
} from 'rxjs';

const pair = <A, B>(a: A, b: B) => [a, b] as readonly [A, B];

type Pair<A, B> = Observable<readonly [A, B]>;

type lmap = <A, B, C>(
  f: (a: A, c: C) => B,
) => (p: Pair<A, C>) => Pair<B, C>;

type rmap = <A, B, C>(
  f: (b: B, a: A) => C,
) => (p: Pair<A, B>) => Pair<A, C>;

type fmap = <A, B, C>(
  f: (a: A, c: C) => B,
) => (p: Pair<A, C>) => Pair<B, C>;

type bmap = <A, B, C>(
  f: (b: B) => C,
) => (p: Pair<A, B>) => Pair<A, C>;

type lbind = <A, B, C>(
  f: (a: A, c: C) => ObservableInput<B>,
) => (p: Pair<A, C>) => Pair<B, C>;

type rbind = <A, B, C>(
  f: (b: B, c: A) => ObservableInput<C>,
) => (p: Pair<A, B>) => Pair<A, C>;

type bbind = <A, B, C, D>(
  f: (b: A, d: B) => Pair<C, D>,
) => (p: Pair<A, B>) => Pair<C, D>;

const lmap: lmap = (f) => (p) =>
  p.pipe(map(([a, b]) => pair(f(a, b), b)));
const rmap: rmap = (f) => (p) =>
  p.pipe(map(([a, b]) => pair(a, f(b, a))));
const fmap: fmap = (f) => (p) =>
  p.pipe(map(([a, b]) => pair(f(a, b), b)));

const bmap: bmap = (f) => (p) =>
  p.pipe(map(([a, b]) => pair(a, f(b))));

const lbind: lbind = (f) => (p) =>
  p.pipe(
    mergeMap(([a, b]) => from(f(a, b)).pipe(map((c) => pair(c, b)))),
  );

const rbind: rbind = (f) => (p) =>
  p.pipe(
    mergeMap(([a, b]) => from(f(b, a)).pipe(map((c) => pair(a, c)))),
  );

const bbind: bbind = (f) => (p) =>
  p.pipe(mergeMap(([a, b]) => f(a, b)));

export { lmap, rmap, fmap, bmap, lbind, rbind, bbind, pair };
