#!/usr/bin/env bash

# Downloads the codeclimate test reporter and makes it executable

PLATFORM=$(uname -s)

if [ $PLATFORM == "Darwin" ]; then

  curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-darwin-amd64 > ./cc-test-reporter
  chmod +x ./cc-test-reporter

elif [ $PLATFORM == 'Linux' ]; then

  curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
  chmod +x ./cc-test-reporter

else

  echo "Platform $PLATFORM not supported"
  exit 1;

fi

