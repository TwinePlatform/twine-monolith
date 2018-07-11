# Deployment
The Twine API is hosted on Heroku. Ask team members for access credentials.

## Environment
Heroku automatically sets `NODE_ENV` to `'production'`, so it's unnecessary to manually set this.

The database connection URL is passed unchanged to the database client, without adding any flags for SSL. Heroku requires all database connections to be made with SSL. In order to force SSL connections, set the following environment variable:
```
PGSSLMODE=require
```
