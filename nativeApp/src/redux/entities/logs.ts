import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { assoc } from 'ramda';
import { VolunteerLog } from '../../../../api/src/models/types';
import API from '../../api';
import {
  State, LogsState, RequestAction, SuccessAction, ErrorAction,
} from '../types';


/*
 * Actions
 */
enum ActionsType {
  LOAD_LOGS_REQUEST = 'logs/LOAD_REQUEST',
  LOAD_LOGS_ERROR = 'logs/LOAD_ERROR',
  LOAD_LOGS_SUCCESS = 'logs/LOAD_SUCCESS',
}

/*
 * Types
 */

type LoadLogsRequest = RequestAction<ActionsType.LOAD_LOGS_REQUEST>
type LoadLogsSuccess = SuccessAction<ActionsType.LOAD_LOGS_SUCCESS, VolunteerLog[]>
type LoadLogsError = ErrorAction<ActionsType.LOAD_LOGS_ERROR>

type Actions = LoadLogsRequest | LoadLogsSuccess | LoadLogsError;


/*
 * Initial State
 */
const initialState: LogsState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
};


/*
 * Action creators
 */
const loadLogsRequest = createAction(ActionsType.LOAD_LOGS_REQUEST);
const loadLogsError = createAction<Error>(ActionsType.LOAD_LOGS_ERROR);
const loadLogsSuccess = createAction<Partial<VolunteerLog>[]>(ActionsType.LOAD_LOGS_SUCCESS);


/*
 * Thunk creators
 */
export const loadLogs = (since?: Date, until?: Date) => (dispatch) => {
  dispatch(loadLogsRequest());

  return API.VolunteerLogs.get(since, until)
    .then((res) => dispatch(loadLogsSuccess(res.data)))
    .catch((error) => dispatch(loadLogsError(error)));
};

/*
 * Reducer
 */
const reducer: Reducer<LogsState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.LOAD_LOGS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ActionsType.LOAD_LOGS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case ActionsType.LOAD_LOGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchError: null,
        lastUpdated: new Date(),
        order: action.payload.map((log) => log.id),
        items: action.payload.reduce((acc, log) => assoc(String(log.id), log, acc), {}),
      };

    default:
      return state;
  }
};


/*
 * Selectors
 */
export const selectLogs = (state: State) => state.entities.logs.items;
export const selectLogsOrder = (state: State) => state.entities.logs.order;
export const selectOrderedLogs = (state: State) => state.entities.logs.order
  .map((id) => state.entities.logs.items[id]);

export const selectLogsStatus = ({ entities: { logs } }: State) => (
  { isFetching: logs.isFetching, error: logs.fetchError }
);


export default reducer;
