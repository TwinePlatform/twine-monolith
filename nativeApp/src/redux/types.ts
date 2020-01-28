import {
  VolunteerLog, User, VolunteerProject, VolunteerActivity,
} from '../../../api/src/models/types';
import { CurrentUser, Roles } from '../api/types';
import { IdAndName } from '../api';

// Actions
export type RequestAction<T extends string> = {
  type: T;
};

export type SuccessAction <T extends string, U>= {
  type: T;
  payload: U;
};

export type ErrorAction<T extends string> = {
  type: T;
  payload: Error;
};

// State
type RequestState<T> = {
  fetchError: null | Error;
  isFetching: boolean;
  lastUpdated: null | Date;
  items: Record<number, T>;
  order: number[];
};

type ExtendedStateForEditableEntities = {
  createIsFetching: boolean;
  createSuccess: boolean;
  createError: Error;
  updateIsFetching: boolean;
  updateSuccess: boolean;
  updateError: Error;
  deleteIsFetching: boolean;
  deleteError: Error;
}

export type ActivitiesState = RequestState<VolunteerActivity>
export type GendersState = RequestState<IdAndName>
export type RegionsState = RequestState<IdAndName>
export type OrganisationsState = RequestState<IdAndName>

export type BirthYearsState = {
  items: Record<number, IdAndName>;
  order: number[];
}

export type LogsState = RequestState<VolunteerLog> & ExtendedStateForEditableEntities

export type VolunteersState = RequestState<User> & ExtendedStateForEditableEntities

export type ProjectsState = RequestState<VolunteerProject> & {
  createIsFetching: boolean;
  createSuccess: boolean;
  createError: Error;
  updateIsFetching: boolean;
  updateSuccess: boolean;
  updateError: Error;
  deleteIsFetching: boolean;
  deleteError: Error;
}

export type CurrentUserState = {
  rolesFetchError: null | Error;
  rolesIsFetching: boolean;
  rolesSuccess: boolean;
  roles: Pick <Roles, 'roles'>;
  organisationId: Pick <Roles, 'organisationId'>;
  currentUser: CurrentUser;
}

export type State = {
  currentUser: CurrentUserState;
  entities: {
    logs: LogsState;
    volunteers: VolunteersState;
    currentUser: CurrentUserState;
    projects: ProjectsState;
  };
  constants: {
    activities: ActivitiesState;
    genders: GendersState;
    birthYears: BirthYearsState;
    regions: RegionsState;
    organisations: OrganisationsState;
  };
}
