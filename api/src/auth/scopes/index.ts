import { intersection } from 'ramda';
import { AccessEnum, ResourceEnum, PermissionLevelEnum } from '../types';

export type Scope = {
  permissionLevel: PermissionLevelEnum
  access: AccessEnum
  resource: ResourceEnum
};

const toResourceEnum = (s: string): ResourceEnum => {
  switch (s) {
    case ResourceEnum.CONSTANTS:
      return ResourceEnum.CONSTANTS;

    case ResourceEnum.ORG_DETAILS:
      return ResourceEnum.ORG_DETAILS;

    case ResourceEnum.ORG_FEEDBACK:
      return ResourceEnum.ORG_FEEDBACK;

    case ResourceEnum.ORG_VOLUNTEERS:
      return ResourceEnum.USER_DETAILS;

    case ResourceEnum.USER_DETAILS:
      return ResourceEnum.USER_DETAILS;

    case ResourceEnum.VISIT_ACTIVITIES:
      return ResourceEnum.VISIT_ACTIVITIES;

    case ResourceEnum.VISIT_LOGS:
      return ResourceEnum.VISIT_LOGS;

    case ResourceEnum.VOLUNTEER_LOGS:
      return ResourceEnum.VOLUNTEER_LOGS;

    default:
      throw new Error(`Unrecognised resource: ${s}`);
  }
};

const toAccessEnum = (s: string): AccessEnum => {
  switch (s) {
    case AccessEnum.DELETE:
      return AccessEnum.DELETE;

    case AccessEnum.READ:
      return AccessEnum.READ;

    case AccessEnum.WRITE:
      return AccessEnum.WRITE;

    default:
      throw new Error(`Unrecognised access level: ${s}`);
  }
};

const toPermissionLevelEnum = (s: string): PermissionLevelEnum => {
  switch (s) {
    case PermissionLevelEnum.ALL:
      return PermissionLevelEnum.ALL;

    case PermissionLevelEnum.CHILD:
      return PermissionLevelEnum.CHILD;

    case PermissionLevelEnum.OWN:
      return PermissionLevelEnum.OWN;

    case PermissionLevelEnum.PARENT:
      return PermissionLevelEnum.PARENT;

    case PermissionLevelEnum.SIBLING:
      return PermissionLevelEnum.SIBLING;

    default:
      throw new Error(`Unrecognised permission level: ${s}`);
  }
};

export const scopeToString = (s: Scope): string =>
  `${s.resource}-${s.permissionLevel}:${s.access}`;

export const stringToScope = (s: string): Scope => {
  const match = s.match(/(\w+)\-(\w+)\:(\w+)/);

  if (!match) {
    throw new Error(`Not a valid scope: ${s}`);
  }

  return {
    resource: toResourceEnum(match[1]),
    permissionLevel: toPermissionLevelEnum(match[2]),
    access: toAccessEnum(match[3]),
  };
};

export const intersect = (left: string[], right: string[]) =>
  intersection(left.map(stringToScope), right.map(stringToScope)).length > 0;
