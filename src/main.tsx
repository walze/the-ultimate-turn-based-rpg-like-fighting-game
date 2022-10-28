import {StrictMode} from 'react';

import {createRoot} from 'react-dom/client';
import App from './App';
import assert from 'assert';
import {Suspense} from 'react';
import css from './helpers/css';
import {log$} from './helpers/one-liners';

const $root = document.querySelector('#root');
assert($root, 'root element not found');

const root = createRoot($root);

window.css = css;
window.log$ = log$;

root.render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </StrictMode>,
);
