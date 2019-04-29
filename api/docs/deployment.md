# Deployment
The Twine API is hosted on Heroku and deployed automatically from Github. Ask team members for access credentials.

## Environment
Heroku automatically sets `NODE_ENV` to `'production'`, so it's unnecessary to manually set this.

The database connection URL is passed unchanged to the database client, without adding any flags for SSL. Heroku requires all database connections to be made with SSL. In order to force SSL connections, set the following environment variable:
```
PGSSLMODE=require
```

## Dependencies
External dependencies are specified in the normal way in the `package.json`.

Dependencies on other twine-monolith libraries should be specified by [local path dependencies](https://docs.npmjs.com/files/package.json#local-paths). This is a requirement because the Nodejs heroku buildpack does not support peer dependencies in `lerna` projects.
