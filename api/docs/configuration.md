# Configuration

All application configuration is stored in the `/config` directory located in the project root.

Secrets and configuration variables that are likely to change between deployment environments are stored in a `.env` file. This file should NOT be checked into source control.

Default configuration variables are stored in `config.defaults.js`. Configuration parameters specific to `development`, `testing` and `production` environments are stored in `config.development.js`, `config.testing.js` and `config.production.js` respectively.

To create a project configuration, create the `.env` file in the config directory. Populate it with `=`-separated key-value pairs. Ensure at least the following parameters are provided:

```
# Postgres connection strings for postgres server in various environments
# DATABASE_URL is used in production, the others are suffixed with their environments
#
DATABASE_URL=...
DATABASE_URL_DEVELOPMENT=...
DATABASE_URL_TESTING=...

# Maximum number of database clients to keep in pool
# Must be compatible with the maximum number of client connections allowed by postgres
# provider
DATABASE_POOL_LIMIT=...

# Redis connection strings for redis server in various environments
# REDIS_URL is used in production, the others are suffixed with their environments
REDIS_URL=...
REDIS_URL_DEVELOPMENT=...
REDIS_URL_TESTING=...

# Postmark API key for various environments
# Postmark is the service used to send e-mails
# NOTE: Use "POSTMARK_API_TEST" as the API key in the "test" environment, this will prevent sending
#       emails when not in production. You may want a real API key in the "dev" environment to allow
#       manual testing
#       See https://github.com/TwinePlatform/twine-visitor/issues/240
#
POSTMARK_KEY_DEVELOPMENT=...
POSTMARK_KEY_TESTING=...
POSTMARK_KEY_PRODUCTION=...

# Used to encrypt cookies for session authentication
COOKIE_PASSWORD=...

# Expiry time in milliseconds of sessions on the server
SESSION_TTL=...

# Used to sign QR codes for visitor authentication
QRCODE_HMAC_SECRET=...

# Whitelist used to determine which CORS origins are permitted to use the API
# Formatted as a comma-separated-list of FQDN.
# Example:
#   CORS_ORIGIN=https://foo.example.com,https://bar.example.com,https://www.otherdomain.com
#
CORS_ORIGIN=...

# App Domains
# Used to help the system generate URLs dynamically to the appropriate domains
# Must be formatted as FQDN.
# Example:
#   ADMIN_APP_DOMAIN=https://admin.twine-together.com
#
ADMIN_APP_DOMAIN=...
DASHBOARD_APP_DOMAIN=...
TWINE_API_DOMAIN=...
VISITOR_APP_DOMAIN=...
VOLUNTEER_APP_DOMAIN=...

# "from" e-mail address
# E-mail address used in the "from" field for all e-mails sent by the API
EMAIL_FROM_ADDRESS=...

# Node Environment
# Environment must be specified to start the server.
#
# Supported environments testing | development | production

NODE_ENV=...

# Heroku Webhook Config

# list of emails separated by ,
DEVELOPER_EMAILS=...
# secret supplied by heroku, contact team if this is needed
HEROKU_WEBHOOK_SECRET=
```

### Note
On Windows, it is not possible to create a file with the name `.env`. Instead create a file with the name `.env.` (note the trailing dot).
