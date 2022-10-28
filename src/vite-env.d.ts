/// <reference types="vite/client" />

import css from './helpers/css';
import {log$} from './helpers/one-liners';

import {PropsWithChildren} from 'react';
import {AssertionError as AE} from './helpers/assert_id';
import type {Event, User as U} from '@daml/ledger';
import {Party} from '@daml/types';

type Log$ = typeof log$;
type Css = typeof css;

declare module '@daml/ledger' {
  export interface User extends U {
    primaryParty: Party;
  }

  export const User: User;
}

declare global {
  type Props<T = unknown> = PropsWithChildren<T> & {
    className?: string;
  };

  export type ExerciseFixer<T extends object, R = any> = Promise<
    [R, Event<T>[]]
  >;

  class AssertionError<T> extends AE<T> {}

  const css: Css = css;
  const log$: Log$ = log$;

  interface Window {
    css: Css;
    log$: Log$;
  }
}
