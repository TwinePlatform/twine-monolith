import * as Standard from './strategies/standard';
import * as External from './strategies/external';
import * as HerokuWebHooks from './strategies/heroku_webhook';
import { PermissionLevelEnum } from './types';

const strategies = { Standard, External, HerokuWebHooks };

export {
  PermissionLevelEnum,
  strategies,
};
