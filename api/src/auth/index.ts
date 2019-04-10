import * as Standard from './strategies/standard';
import * as External from './strategies/external';
import { PermissionLevelEnum } from './types';

const strategies = { Standard, External };

export {
  PermissionLevelEnum,
  strategies,
};
