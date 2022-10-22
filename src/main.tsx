import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import assert from 'assert'


const root$ = document.querySelector('#root')
assert(root$, 'root element not found')

const root = createRoot(root$)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
