#!/bin/bash

set -eo pipefail

daml codegen js

npx rimraf dist

ts-node --esm daml.build.ts -P ./tsconfig.json

pnpm i @daml.js/daml-project@./dist/daml-project-1.0.0
