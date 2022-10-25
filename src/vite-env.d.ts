/// <reference types="vite/client" />

import type css from './helpers/css';

import { PropsWithChildren } from 'react';
import { AssertionError as AE } from './helpers/assert_id';

declare global {
  type Props<T = unknown> = PropsWithChildren<T> & {
    className?: string;
  };

  class AssertionError<T> extends AE<T> {}

  const css = css;

  interface Window {
    css: typeof css;
  }
}
