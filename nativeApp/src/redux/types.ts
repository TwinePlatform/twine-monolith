import {
  VolunteerLog, User, VolunteerProject, VolunteerActivity,
} from '../../../api/src/models/types';
import { CurrentUser } from '../api/types';

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

export type SupportState = {
  modalOpen: boolean;
}

export type CurrentUserState = { data: CurrentUser }

export type State = {
  currentUser: CurrentUserState;
  entities: {
    logs: LogsState;
    volunteers: VolunteersState;
    currentUser: CurrentUserState;
    projects: ProjectsState;
    support: SupportState,
  };
  constants: {
    activities: ActivitiesState;
  };
}
