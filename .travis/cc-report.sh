#!/usr/bin/env bash

if [ ! -f ./cc-test-reporter ]; then
  echo "No test reporter found";
  exit 1;
fi

echo "Formatting coverage reports for applications"

for f in "api" "dashboard-app" "visitor-app"; do
  if [ -d $f ]; then
    echo $f;
    ./cc-test-reporter format-coverage -t lcov -o coverage/coverage.${f//\//-}.json $f/coverage/lcov.info;
  fi
done;

echo "Formatting coverage reports for libraries"

for f in lib/*; do
  if [ -d $f ]; then
    echo $f;
    ./cc-test-reporter format-coverage -t lcov -o coverage/coverage.${f//\//-}.json $f/coverage/lcov.info;
  fi
done;

echo "Summing coverage reports"
./cc-test-reporter sum-coverage -o coverage/coverage.total.json coverage/coverage.*.json;

echo "Uploading overall coverage report"
./cc-test-reporter upload-coverage -i coverage/coverage.total.json;
