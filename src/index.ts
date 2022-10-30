import assert from 'assert';
import App from './App.svelte';

const target = document.querySelector('#root');
assert(target, 'target not found');

const app = new App({
  target,
});

export default app;
