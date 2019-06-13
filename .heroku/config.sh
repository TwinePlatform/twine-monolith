#!/usr/bin/env bash

# Copy environment variables from a heroku app to a file
# Set heroku app environment variables from a file
#
# See https://emirkarsiyakali.com/heroku-copying-environment-variables-from-an-existing-app-to-another-9253929198d9
#
# Usage
#   $ bash config.sh [MODE] [app_name] [output_file]
#
# MODE        - "get" or "put"
# app_name    - Name of heroku app to target
# output_file - File to write to (if MODE="get") or read from (if MODE="put")
#

FUNCTION=$1
HEROKU_APP=$2
OUTPUT_FILE=${3:-config.txt}


if [ $FUNCTION != "get" -a $FUNCTION != "put" ]; then
  echo "First argument must be either 'get' or 'put'"
  exit 1
fi

if [ -z $HEROKU_APP ]; then
  echo "Must provide heroku app"
  exit 1
fi

if [ $FUNCTION == "get" ]; then
  heroku config -s -a $HEROKU_APP > $OUTPUT_FILE
fi

if [ $FUNCTION == "put" ]; then
  cat $OUTPUT_FILE | tr "\n" " " | xargs heroku config:set -a $HEROKU_APP
fi
