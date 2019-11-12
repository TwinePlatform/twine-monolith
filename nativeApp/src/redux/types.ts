import { VolunteerLog, User } from '../../../api/src/models/types';

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
export type RequestState<T> = {
  fetchError: null | Error;
  isFetching: boolean;
  lastUpdated: null | Date;
  items: Record<number, T>;
  order: number[];
};

export type LogsState = RequestState<VolunteerLog>
export type VolunteersState = RequestState<User> & {
  updateIsFetching: boolean;
  updateError: Error; }

export type State = {
  entities: {
    logs: LogsState;
    volunteers: VolunteersState;
  };
}
