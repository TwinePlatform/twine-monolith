/*
 * Enumerations
 */

export enum AccessEnum {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

export enum ResourceEnum {
  CONSTANTS = 'constants',
  ORG_DETAILS = 'organisations_details',
  ORG_FEEDBACK = 'organisations_feedback',
  ORG_VOLUNTEERS = 'organisations_volunteers',
  USER_DETAILS = 'user_details',
  VISIT_ACTIVITIES = 'visit_activities',
  VISIT_LOGS = 'visit_logs',
  VOLUNTEER_LOGS = 'volunteer_logs',
}

export enum PermissionLevelEnum {
  OWN = 'own',
  CHILD = 'child',
  PARENT = 'parent',
  SIBLING = 'sibling',
  ALL = 'all',
}
