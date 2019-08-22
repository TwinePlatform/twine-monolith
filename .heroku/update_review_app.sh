
function _deploy_branch () {
  local BRANCH=$1
  local APP_NAME=$2

  echo "Deploying branch $BRANCH to app $APP_NAME"

  if [ ! -z $BRANCH ]; then
    REMOTE_EXISTS=$(git remote -v | grep "git.heroku.com/$APP_NAME.git")

    if [ -z $REMOTE_EXISTS ]; then
      heroku git:remote -a $APP_NAME -r "heroku-$APP_NAME"
      # git remote add "heroku-$APP_NAME" "https://git.heroku.com/$APP_NAME.git"
    fi

    git pull origin $BRANCH
    git push "heroku-$APP_NAME" "$BRANCH:master"

    if [ -z $REMOTE_EXISTS ]; then
      git remote rm "heroku-$APP_NAME"
    fi
  fi
}


while getopts avd opt; do
  case $opt in
    a) UPDATE_API="true";;
    v) UPDATE_VISITOR="true";;
    d) UPDATE_DASHBOARD="true";;
    *) terminate "Unrecognised option $opt: only a, v, d supported"
  esac
done
shift $(( OPTIND - 1 )) # Ignore flag arguments from $N

PR=$1
BRANCH=$2


if [ -z $PR ]; then
  terminate "Must provide a name for the app"
fi

if [ -z $(which heroku) ]; then
  terminate "Must have heroku CLI installed"
fi

if [ $(heroku auth:whoami) != "powertochangetwine@gmail.com" ]; then
  terminate "Must be logged in as pipeline owner"
fi

# Main

API_TARGET="twine-api-staging"

if [ "$UPDATE_API" = "true" ]; then
  echo "Updating review API app twine-api-pr-$PR"
  _deploy_branch $BRANCH "twine-api-pr-$PR"
fi

if [ "$UPDATE_VISITOR" = "true" ]; then
  echo "Updating review API app twine-visitor-pr-$PR"
  _deploy_branch $BRANCH "twine-visitor-pr-$PR"
fi

if [ "$UPDATE_DASHBOARD" = "true" ]; then
  echo "Updating review API app twine-dashboard-pr-$PR"
  _deploy_branch $BRANCH "twine-dashboard-pr-$PR"
fi
