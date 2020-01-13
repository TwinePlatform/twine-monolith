import { VolunteerLog, User, VolunteerProject } from '../../../api/src/models/types';
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

export type LogsState = RequestState<VolunteerLog>
export type VolunteersState = RequestState<User> & {
  createIsFetching: boolean;
  createSuccess: boolean;
  createError: Error;
  updateIsFetching: boolean;
  updateSuccess: boolean;
  updateError: Error;
  deleteIsFetching: boolean;
  deleteError: Error;
}

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

export type CurrentUserState = { data: CurrentUser }

export type State = {
  currentUser: CurrentUserState;
  entities: {
    logs: LogsState;
    volunteers: VolunteersState;
    currentUser: CurrentUserState;
    projects: ProjectsState;
  };
}
