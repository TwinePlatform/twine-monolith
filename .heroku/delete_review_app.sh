#!/usr/bin/env bash

# Deletes all apps created against a specific PR
#
# Usage:
#  $ bash delete_app.sh <PR>
#
# Example:
#  $ bash delete_app.sh 227
#
# Arguments:
#  PR - Number of the PR whose apps should be deleted
#
# See also
# https://stackoverflow.com/questions/1885525/how-do-i-prompt-a-user-for-confirmation-in-bash-script


PR=$1

APPS=$(heroku apps | grep "pr-$PR" | cut -f1 -d" ")

echo "This will delete the following apps:"
echo $APPS
read "Are you sure? (y/n)" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  for APP in $APPS; do
    heroku apps:destroy -a $APP
  done
fi
