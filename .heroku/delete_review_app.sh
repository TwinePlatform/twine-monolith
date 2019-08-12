#!/usr/bin/env bash

# Deletes all apps created against a specific PR.
# Note no user confirmation is required in this script, because the
# Heroku CLI already requires user confirmation for each app deletion
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

for APP in $APPS; do
  heroku apps:destroy -a $APP
done
