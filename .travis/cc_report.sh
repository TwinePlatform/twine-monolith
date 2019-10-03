#!/usr/bin/env bash

DIR=$(dirname $0)
TEMP=$(dirname $DIR)
ROOT=$(cd $TEMP 2> /dev/null && pwd -P)

if [ ! -f "$DIR/cc-test-reporter" ]; then
  echo "No test reporter found";
  exit 1;
fi


function format_lcov () {
  for f in $@; do
    if [ -f $f ]; then
      FILENAME=$(echo "$f" | cut -c3- | sed s_\/_-_g | sed s/.info/.json/)
      DESTINATION="$ROOT/coverage-$FILENAME"

      echo "Formatting $f into $DESTINATION"
      $DIR/cc-test-reporter format-coverage -t lcov -o $DESTINATION $f

      echo "Normalising file paths"
      node $DIR/normalise_paths.js $DESTINATION
    fi
  done
}

files=$(find "$ROOT" -name 'lcov.info' -type f -not -path "*/node_modules/*")
echo "Found coverage info in:"
echo "$files"

format_lcov ${files[@]}
