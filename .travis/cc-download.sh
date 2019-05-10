#!/usr/bin/env bash

# Downloads the codeclimate test reporter and makes it executable

curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
