import { AccessEnum, ResourceEnum, PermissionLevelEnum } from '../types';

export type Scope = {
  permissionLevel: PermissionLevelEnum
  access: AccessEnum
  resource: ResourceEnum
};

export const scopeToString = (s: Scope): string =>
  `${s.resource}-${s.permissionLevel}:${s.access}`;
