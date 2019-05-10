#!/usr/bin/env bash

if [ ! -f ./cc-test-reporter ]; then
  echo "No test reporter found";
  exit 1;
fi

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo "Skipping coverage uploads for PR build"
  exit 0;
fi

function format_lcov () {
  for f in $@; do
    if [ -f $1 ]; then
      echo "Formatting $f";
      ./cc-test-reporter format-coverage -t lcov -o coverage/coverage.${1//\//-}.json $1;
    fi
  done
}

files=$(find . -name 'lcov.info' -type f -not -path "*/node_modules/*")
format_lcov ${files[@]}

echo "Summing coverage reports"
./cc-test-reporter sum-coverage -o coverage/coverage.total.json coverage/coverage.*.json;

echo "Uploading overall coverage report"
./cc-test-reporter upload-coverage -i coverage/coverage.total.json;
