require('dotenv').config({ path: './config/.env' });
const path = require('path');


exports.getConfig = (env = process.env.NODE_ENV) => ({
  env,
  root: path.resolve(__dirname, '..'),
  web: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 2000,
    router: { stripTrailingSlash: true },
    routes: {
      security: {
        hsts: {
          maxAge: 365 * 24 * 60 * 60,
          includeSubdomains: true,
          preload: true,
        },
      },
    },
  },
});
