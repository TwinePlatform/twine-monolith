#!/usr/bin/env bash

DIR=$(dirname $0)
ROOT=$(dirname $DIR)

if [ ! -z $1 ]; then
  ROOT=$1
fi

if [ ! -f "$DIR/cc-test-reporter" ]; then
  echo "No test reporter found";
  exit 1;
fi

function format_lcov () {
  for f in $@; do
    if [ -f $f ]; then
      FILENAME=$(echo "$f" | cut -c3- | sed s_\/_-_g | sed s/.info/.json/)

      echo "Formatting $f into coverage/coverage-${FILENAME}";
      $DIR/cc-test-reporter format-coverage -t lcov -o coverage/coverage-${FILENAME} $f;

      echo "Contents:"
      echo $(cat coverage/coverage-${FILENAME} | head -n 100)
    fi
  done
}

files=$(find "$ROOT" -name 'lcov.info' -type f -not -path "*/node_modules/*")
echo "Found coverage info in:"
echo "$files"

format_lcov ${files[@]}

# echo "Summing coverage reports"
# $DIR/cc-test-reporter sum-coverage -o coverage/coverage.total.json coverage/*coverage-*.json;

# echo "Overall Result: $(cat coverage/coverage.total.json | grep covered_percent | head -n 1)"
# echo "Contents:"
# echo $(cat coverage/coverage.total.json | head -n 100)

# echo "Uploading overall coverage report"
# $DIR/cc-test-reporter upload-coverage -i coverage/coverage.total.json;
