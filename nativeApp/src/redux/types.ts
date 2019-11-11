import { VolunteerLog, User } from '../../../api/src/models/types';


export type LogsState = {
  fetchError: null | Error;
  isFetching: boolean;
  lastUpdated: null | Date;
  items: Record<number, VolunteerLog>;
  order: number[];
};

export type VolunteersState = {
  fetchError: null | Error;
  isFetching: boolean;
  lastUpdated: null | Date;
  items: Record<number, User>;
  order: number[];
};

export type State = {
  entities: {
    logs: LogsState;
    volunteers: VolunteersState;
  };
}
