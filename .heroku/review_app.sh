#!/usr/bin/env bash

# Manage a heroku review apps from command line
#
# Usage:
#  $ bash review_app.sh [-avdf] <COMMAND> <PR> <BRANCH>
#
# Examples:
#  $ bash review_app.sh -vd create 242 dash/create-widget
#  $ bash review_app.sh -vd update 242 dash/create-widget
#  $ bash review_app.sh delete 242
#
# Arguments:
#  COMMAND - "create" | "update" | "delete"
#  PR      - Number of the PR that this set of apps should be created for (e.g. 132)
#  BRANCH  - Branch from which apps should be deployed
#
# Flags
#  a - CMD argument targets review version of the API
#  v - CMD argument targets review version of the visitor app
#  d - CMD argument targets review version of the dashboard app
#  f - Force push changes from BRANCH


#######################
#       Helpers       #
#######################

function terminate () {
  if [ ! -z $1 ]; then
    echo $1
  fi
  exit 1
}

function _deploy_branch () {
  local APP_NAME=$1
  local BRANCH=$2

  if [ ! -z $BRANCH ]; then
    echo "Deploying branch $BRANCH to app $APP_NAME"

    REMOTE_EXISTS=$(git remote -v | grep "git.heroku.com/$APP_NAME.git")

    if [ -z $REMOTE_EXISTS ]; then
      heroku git:remote -a $APP_NAME -r "heroku-$APP_NAME"
    fi

    git pull origin $BRANCH
    git push "heroku-$APP_NAME" "$BRANCH:master"

    if [ -z $REMOTE_EXISTS ]; then
      git remote rm "heroku-$APP_NAME"
    fi
  fi
}


#######################
#        CREATE       #
#######################

function _create_app () {
  local APP_NAME=$1
  local TEMPLATE_APP_NAME=$2
  local PIPELINE_NAME=$3
  local API_APP=$4
  local BRANCH=$5

  # Create in EU w/ our buildpack
  heroku apps:create $APP_NAME --region eu --buildpack https://github.com/TwinePlatform/heroku-buildpack-select-subdir

  # Clone config
  bash $(dirname $0)/config.sh get $TEMPLATE_APP_NAME _temp_cfg_dump.txt
  bash $(dirname $0)/config.sh put $APP_NAME _temp_cfg_dump.txt
  rm _temp_cfg_dump.txt

  # Add to staging area in pipeline
  heroku pipelines:add $PIPELINE_NAME -a $APP_NAME -s staging

  # Point proxy at given API
  if [ ! -z $API_APP ]; then
    heroku config:set PROXY_API_URL="https://$API_APP.herokuapp.com" -a $APP_NAME
  fi

  _deploy_branch $APP_NAME $BRANCH
}

function _create () {
  local PR=$1
  local BRANCH=$2
  local API_TARGET="twine-api-staging"

  if [ "$ACT_ON_API" = "true" ]; then
    echo "Creating review API app 'twine-api-pr-$PR'"
    _create_app "twine-api-pr-$PR" "twine-api-staging" "twine-api-pipeline" "" $BRANCH
    API_TARGET="twine-api-pr-$PR"
  fi

  if [ "$ACT_ON_VISITOR" = "true" ]; then
    echo "Creating review API app 'twine-visitor-pr-$PR'"
    _create_app "twine-visitor-pr-$PR" "twine-visitor-staging" "twine-visitor-pipeline" $API_TARGET $BRANCH
  fi

  if [ "$ACT_ON_DASHBOARD" = "true" ]; then
    echo "Creating review API app 'twine-dashboard-pr-$PR'"
    _create_app "twine-dashboard-pr-$PR" "twine-dashboard-staging" "twine-volunteer-dashboard" $API_TARGET $BRANCH
  fi
}


#######################
#        UPDATE       #
#######################

function _update_app () {
  _deploy_branch $1 $2
}

function _update () {
  local PR=$1
  local BRANCH=$2

  if [ "$ACT_ON_API" = "true" ]; then
    echo "Updating 'twine-api-pr-$PR'"
    _update_app "twine-api-pr-$PR" $BRANCH
  fi

  if [ "$ACT_ON_VISITOR" = "true" ]; then
    echo "Updating 'twine-visitor-pr-$PR'"
    _update_app "twine-visitor-pr-$PR" $BRANCH
  fi

  if [ "$ACT_ON_DASHBOARD" = "true" ]; then
    echo "Updating 'twine-dashboard-pr-$PR'"
    _update_app "twine-dashboard-pr-$PR" $BRANCH
  fi
}


#######################
#        DELETE       #
#######################

function _delete_app () {
  heroku apps:destroy -a $1
}

function _delete () {
  local PR=$1

  APPS=$(heroku apps | grep "pr-$PR" | cut -f1 -d" ")

  for APP in $APPS; do
    _delete_app $APP
  done
}


#######################
# Argument Processing #
#######################

while getopts avd opt; do
  case $opt in
    a) ACT_ON_API="true";;
    v) ACT_ON_VISITOR="true";;
    d) ACT_ON_DASHBOARD="true";;
    f) FORCE_PUSH="true";;
    *) terminate "Unrecognised option $opt: only a, v, d supported"
  esac
done
shift $(( OPTIND - 1 )) # Ignore flag arguments from $N

CMD=$1
PR=$2
BRANCH=$3


#######################
#     Validation      #
#######################

if [ -z $(which heroku) ]; then
  terminate "Must have heroku CLI installed"
fi

if [ $(heroku auth:whoami) != "powertochangetwine@gmail.com" ]; then
  terminate "Must be logged in as pipeline owner"
fi

if [ -z "$PR" ]; then
  terminate "Must provide a name for the app"
fi

if [ -z "$BRANCH" -a "$CMD" = "update" ]; then
  terminate "Third argument (branch name) must be supplied when updating"
fi

#######################
#         Main        #
#######################
case $CMD in
  create) _create "$PR" "$BRANCH";;
  update) _update "$PR" "$BRANCH";;
  delete) _delete "$PR";;
  *)      terminate "First argument must be 'create', 'update' or 'delete'"
esac
