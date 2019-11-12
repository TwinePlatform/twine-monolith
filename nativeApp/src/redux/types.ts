import { VolunteerLog, User } from '../../../api/src/models/types';


export type RequestState<T> = {
  fetchError: null | Error;
  isFetching: boolean;
  lastUpdated: null | Date;
  items: Record<number, T>;
  order: number[];
};

export type LogsState = RequestState<VolunteerLog>
export type VolunteersState = RequestState<User>

export type State = {
  entities: {
    logs: LogsState;
    volunteers: VolunteersState;
  };
}
