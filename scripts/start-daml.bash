#!/bin/bash

set -eo pipefail

npx concurrently \
  -c "red,green,yellow,blue,magenta,cyan,white,gray" \
  --kill-others-on-fail \
  "pnpm:dev:daml:*"
