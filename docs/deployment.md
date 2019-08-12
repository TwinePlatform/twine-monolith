# Deployment
All platform apps are currently hosted on Heroku. Most Heroku buildpacks assume a 1-repo to 1-app model, and so don't support monorepos. Instead we must use a [custom buildpack](https://github.com/TwinePlatform/heroku-buildpack-select-subdir), in conjunction with the standard Node.js buildpack.

## Creating a New App
Either using the Heroku CLI or the Web UI:
1. Create a new Heroku app (region must be EU for GDPR purposes)
2. Add the app to a pipeline (where appropriate)
3. On the `Deploy` tab, connect the app to the monorepo
4. Configure the application's [environment variables](#configuring-the-environment)

## Configuring the Environment
For the most part, the individual application documentation will detail the environment variables that are necessary for running the app. However, there are some common variables that are necessary for a working deployment:

| Environment variable | Value | Description |
|----------------------|-------|-------------|
| `BUILDPACK`          | `DIRECTORY=BUILDPACK_URL` | Determines which subdirectory to deploy and which buildpack to use (example: `api=https://github.com/heroku/heroku-buildpack-nodejs`)|
| `NODE_MODULES_CACHE` | `false` | Required to prevent build problems caused by local dependencies |
