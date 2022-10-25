/// <reference types="vite/client" />

import css from './helpers/css';
import { log$ } from './helpers/one-liners';

import { PropsWithChildren } from 'react';
import { AssertionError as AE } from './helpers/assert_id';

type Log$ = typeof log$;
type Css = typeof css;

declare global {
  type Props<T = unknown> = PropsWithChildren<T> & {
    className?: string;
  };

  class AssertionError<T> extends AE<T> {}

  const css: Css = css;
  const log$: Log$ = log$;

  interface Window {
    css: Css;
    log$: Log$;
  }
}
