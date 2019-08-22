#!/usr/bin/env bash

# Manage a heroku review apps from command line
#
# Usage:
#  $ bash review_app.sh -avd <COMMAND> <PR> <BRANCH>
#
# Examples:
#  $ bash review_app.sh -vd create 242 dash/create-widget
#  $ bash review_app.sh -vd update 242 dash/create-widget
#  $ bash review_app.sh -vd delete 242
#
# Arguments:
#  COMMAND - "create" | "update" | "delete"
#  PR      - Number of the PR that this set of apps should be created for (e.g. 132)
#  BRANCH  - Branch from which apps should be deployed
#
# Flags
#  a - Setup a new review version of the API
#  v - Setup a new review version of the visitor app
#  d - Setup a new review version of the dashboard app


function terminate () {
  if [ ! -z $1 ]; then
    echo $1
  fi
  exit 1
}
