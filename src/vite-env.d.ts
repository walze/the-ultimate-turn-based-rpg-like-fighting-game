/// <reference types="vite/client" />

import type css from './helpers/css';

import { PropsWithChildren } from 'react';

declare global {
  type Props<T = unknown> = PropsWithChildren<T> & {
    className?: string;
  };

  const css = css;

  interface Window {
    css: typeof css;
  }
}
