#!/usr/bin/env bash

DIR=$(dirname $0)
ROOT=$(dirname $DIR)

if [ ! -f "$DIR/cc-test-reporter" ]; then
  echo "No test reporter found";
  exit 1;
fi

if [ "$CI" = "true" ]; then
  PREFIX="$TRAVIS_BUILD_DIR/$APP_DIR"
fi

function format_lcov () {
  for f in $@; do
    if [ -f $f ]; then
      FILENAME=$(echo "$f" | cut -c3- | sed s_\/_-_g | sed s/.info/.json/)
      DESTINATION="$ROOT/coverage-$FILENAME"

      echo "Formatting $f into $DESTINATION";
      $DIR/cc-test-reporter format-coverage -t lcov -o $DESTINATION --add-prefix $PREFIX $f;

      echo "Contents:"
      echo $(cat $DESTINATION | head -n 100)
    fi
  done
}

files=$(find "$ROOT" -name 'lcov.info' -type f -not -path "*/node_modules/*")
echo "Found coverage info in:"
echo "$files"

format_lcov ${files[@]}
