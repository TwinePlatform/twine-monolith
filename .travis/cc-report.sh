#!/usr/bin/env bash

DIR=$(dirname $0)
ROOT=$(dirname $DIR)

if [ ! -f "$DIR/cc-test-reporter" ]; then
  echo "No test reporter found";
  exit 1;
fi

function format_lcov () {
  for f in $@; do
    if [ -f $f ]; then
      FILENAME=$(echo "$f" | cut -c3- | sed s_\/_-_g | sed s/.info/.json/)

      echo "Formatting $f into coverage/coverage/${FILENAME}";
      $DIR/cc-test-reporter format-coverage -t lcov -o coverage/coverage-${FILENAME} $1;
    fi
  done
}

files=$(find "$ROOT" -name 'lcov.info' -type f -not -path "*/node_modules/*")
format_lcov ${files[@]}

echo "Summing coverage reports"
$DIR/cc-test-reporter sum-coverage -o coverage/coverage.total.json coverage/*coverage-*.json;

echo "Uploading overall coverage report"
$DIR/cc-test-reporter upload-coverage -i coverage/coverage.total.json;
