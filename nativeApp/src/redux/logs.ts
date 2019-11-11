import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { assoc } from 'ramda';
import { VolunteerLog } from '../../../api/src/models/types';
import { VolunteerLogs } from '../lib/api';
import { State, LogsState } from './types';


/*
 * Actions
 */
const LOAD_LOGS_REQUEST = 'logs/LOAD_REQUEST';
const LOAD_LOGS_ERROR = 'logs/LOAD_ERROR';
const LOAD_LOGS_SUCCESS = 'logs/LOAD_SUCCESS';


/*
 * Types
 */
type LoadLogsRequest = {
  type: typeof LOAD_LOGS_REQUEST;
};

type LoadLogsSuccess = {
  type: typeof LOAD_LOGS_SUCCESS;
  payload: VolunteerLog[];
};

type LoadLogsError = {
  type: typeof LOAD_LOGS_ERROR;
  payload: Error;
};

type Actions = LoadLogsRequest | LoadLogsSuccess | LoadLogsError;


/*
 * Initial State
 */
const entityInitialState: LogsState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
};


/*
 * Action creators
 */
const loadLogsRequest = createAction(LOAD_LOGS_REQUEST);
const loadLogsError = createAction<Error>(LOAD_LOGS_ERROR);
const loadLogsSuccess = createAction<Partial<VolunteerLog>[]>(LOAD_LOGS_SUCCESS);


/*
 * Thunk creators
 */
export const loadLogs = (since?: Date, until?: Date) => (dispatch) => {
  dispatch(loadLogsRequest());

  return VolunteerLogs.get(since, until)
    .then((res) => dispatch(loadLogsSuccess(res.data)))
    .catch((error) => dispatch(loadLogsError(error)));
};

/*
 * Reducer
 */
const reducer: Reducer<LogsState, Actions> = (state, action) => {
  switch (action.type) {
    case LOAD_LOGS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case LOAD_LOGS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case LOAD_LOGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchError: null,
        lastUpdated: new Date(),
        order: action.payload.map((log) => log.id),
        items: action.payload.reduce((acc, log) => assoc(String(log.id), log, acc), {}),
      };

    default:
      return { ...entityInitialState };
  }
};


/*
 * Selectors
 */
export const selectLogs = (state: State) => state.entities.logs.items;
export const selectLogsOrder = (state: State) => state.entities.logs.order;
export const selectOrderedLogs = (state: State) => state.entities.logs.order
  .map((id) => state.entities.logs.items[id]);


export default reducer;
