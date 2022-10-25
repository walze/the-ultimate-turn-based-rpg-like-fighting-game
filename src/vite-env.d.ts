/// <reference types="vite/client" />

import type css from './helpers/css';
import type log$ from './helpers/one-liners';

import { PropsWithChildren } from 'react';
import { AssertionError as AE } from './helpers/assert_id';

declare global {
  type Props<T = unknown> = PropsWithChildren<T> & {
    className?: string;
  };

  class AssertionError<T> extends AE<T> {}

  const css = css;
  const log$ = log$;

  interface Window {
    css: typeof css;
    log$: typeof log$;
  }
}
