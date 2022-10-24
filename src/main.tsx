import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import App from './App';
import assert from 'assert';
import { Suspense } from 'react';
import css from './helpers/css';

const $root = document.querySelector('#root');
assert($root, 'root element not found');

const root = createRoot($root);

window.css = css;

root.render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </StrictMode>,
);
