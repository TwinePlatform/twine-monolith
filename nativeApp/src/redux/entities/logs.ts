import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { assoc } from 'ramda';
import { VolunteerLog } from '../../../../api/src/models/types';
import API, { getErrorResponse } from '../../api';
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

  CREATE_LOG_REQUEST = 'log/CREATE_REQUEST',
  CREATE_LOG_ERROR = 'log/CREATE_ERROR',
  CREATE_LOG_SUCCESS = 'log/CREATE_SUCCESS',
  CREATE_LOG_RESET = 'log/CREATE_RESET',

  UPDATE_LOG_REQUEST = 'log/UPDATE_REQUEST',
  UPDATE_LOG_ERROR = 'log/UPDATE_ERROR',
  UPDATE_LOG_SUCCESS = 'log/UPDATE_SUCCESS',
  UPDATE_LOG_RESET = 'log/UPDATE_RESET',

  DELETE_LOG_REQUEST = 'log/DELETE_REQUEST',
  DELETE_LOG_ERROR = 'log/DELETE_ERROR',
  DELETE_LOG_SUCCESS = 'log/DELETE_SUCCESS',
}

/*
 * Types
 */

type LoadLogsRequest = RequestAction<ActionsType.LOAD_LOGS_REQUEST>
type LoadLogsSuccess = SuccessAction<ActionsType.LOAD_LOGS_SUCCESS, VolunteerLog[]>
type LoadLogsError = ErrorAction<ActionsType.LOAD_LOGS_ERROR>


type CreateLogRequest = RequestAction<ActionsType.CREATE_LOG_REQUEST>
type CreateLogSuccess = SuccessAction<ActionsType.CREATE_LOG_SUCCESS, VolunteerLog[]>
type CreateLogError = ErrorAction<ActionsType.CREATE_LOG_ERROR>
type CreateLogReset = RequestAction<ActionsType.CREATE_LOG_RESET>

type UpdateLogRequest = RequestAction<ActionsType.UPDATE_LOG_REQUEST>
type UpdateLogSuccess = SuccessAction<ActionsType.UPDATE_LOG_SUCCESS, VolunteerLog[]>
type UpdateLogError = ErrorAction<ActionsType.UPDATE_LOG_ERROR>
type UpdateLogReset = RequestAction<ActionsType.UPDATE_LOG_RESET>

type DeleteLogRequest = RequestAction<ActionsType.DELETE_LOG_REQUEST>
type DeleteLogSuccess = SuccessAction<ActionsType.DELETE_LOG_SUCCESS, VolunteerLog[]>
type DeleteLogError = ErrorAction<ActionsType.DELETE_LOG_ERROR>


type Actions = LoadLogsRequest | LoadLogsSuccess | LoadLogsError
  | CreateLogRequest | CreateLogSuccess | CreateLogError | CreateLogReset
  | UpdateLogRequest | UpdateLogSuccess | UpdateLogError | UpdateLogReset
  | DeleteLogRequest | DeleteLogSuccess | DeleteLogError;


/*
 * Initial State
 */
const initialState: LogsState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
  createIsFetching: false,
  createSuccess: false,
  createError: null,
  updateIsFetching: false,
  updateError: null,
  updateSuccess: false,
  deleteIsFetching: false,
  deleteError: null,
};


/*
 * Action creators
 */
const loadLogsRequest = createAction(ActionsType.LOAD_LOGS_REQUEST);
const loadLogsError = createAction<Error>(ActionsType.LOAD_LOGS_ERROR);
const loadLogsSuccess = createAction<Partial<VolunteerLog>[]>(ActionsType.LOAD_LOGS_SUCCESS);


const createLogRequest = createAction(ActionsType.CREATE_LOG_REQUEST);
const createLogSuccess = createAction(ActionsType.CREATE_LOG_SUCCESS);
const createLogError = createAction<Error>(ActionsType.CREATE_LOG_ERROR);
export const createLogReset = createAction(ActionsType.CREATE_LOG_RESET);

const updateLogRequest = createAction(ActionsType.UPDATE_LOG_REQUEST);
const updateLogSuccess = createAction(ActionsType.UPDATE_LOG_SUCCESS);
const updateLogError = createAction<Error>(ActionsType.UPDATE_LOG_ERROR);
export const updateLogReset = createAction(ActionsType.UPDATE_LOG_RESET);

const deleteLogRequest = createAction(ActionsType.DELETE_LOG_REQUEST);
const deleteLogSuccess = createAction(ActionsType.DELETE_LOG_SUCCESS);
const deleteLogError = createAction<Error>(ActionsType.DELETE_LOG_ERROR);

/*
 * Thunk creators
 */
export const loadLogs = (since?: Date, until?: Date) => (dispatch) => {
  dispatch(loadLogsRequest());

  return API.VolunteerLogs.get(since, until)
    .then((res) => {
      dispatch(loadLogsSuccess(res.data));
      return res.data;
    })
    .catch((error) => {
      dispatch(loadLogsError(error));
      return error;
    });
};

export const createLog = (values: Partial<VolunteerLog>) => (dispatch) => {
  dispatch(createLogRequest());

  return API.VolunteerLogs.add(values)
    .then((result) => {
      dispatch(createLogSuccess());
      dispatch(loadLogs());
      if (values.note != "") {
        API.Notes.set(values.note, result.data.id, values.activity, values.project, values.startedAt)
      }
      return result;
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(createLogError(errorResponse));
      return error.response.data;
    });
};


export const updateLog = (id: number, name: string) => (dispatch) => {
  dispatch(updateLogRequest());

  return API.VolunteerLogs.update(id, name)
    .then(() => {
      dispatch(updateLogSuccess());
      dispatch(loadLogs());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(updateLogError(errorResponse));
    });
};

export const deleteLog = (id: number) => (dispatch) => {
  dispatch(deleteLogRequest());

  return API.VolunteerLogs.delete(id)
    .then(() => {
      dispatch(deleteLogSuccess());
      dispatch(loadLogs());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(deleteLogError(errorResponse));
    });
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

    // CREATE
    case ActionsType.CREATE_LOG_REQUEST:
      return {
        ...state,
        createIsFetching: true,
        createSuccess: false,
      };

    case ActionsType.CREATE_LOG_ERROR:
      return {
        ...state,
        createIsFetching: false,
        createSuccess: false,
        createError: action.payload,
      };

    case ActionsType.CREATE_LOG_SUCCESS:
      return {
        ...state,
        createIsFetching: false,
        createSuccess: true,
        createError: null,
      };

    case ActionsType.CREATE_LOG_RESET:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: false,
      };

    // UPDATE
    case ActionsType.UPDATE_LOG_REQUEST:
      return {
        ...state,
        updateIsFetching: true,
        updateSuccess: false,
      };

    case ActionsType.UPDATE_LOG_ERROR:
      return {
        ...state,
        updateIsFetching: false,
        updateError: action.payload,
        updateSuccess: false,
      };

    case ActionsType.UPDATE_LOG_SUCCESS:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: true,
      };

    case ActionsType.UPDATE_LOG_RESET:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: false,
      };

    // DELETE
    case ActionsType.DELETE_LOG_REQUEST:
      return {
        ...state,
        deleteIsFetching: true,
      };

    case ActionsType.DELETE_LOG_ERROR:
      return {
        ...state,
        deleteIsFetching: false,
        deleteError: action.payload,
      };

    case ActionsType.DELETE_LOG_SUCCESS:
      return {
        ...state,
        deleteIsFetching: false,
        deleteError: null,
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


export const selectCreateLogStatus = ({ entities: { logs } }: State) => ({
  isFetching: logs.createIsFetching,
  error: logs.createError,
  success: logs.createSuccess,
});

export default reducer;
