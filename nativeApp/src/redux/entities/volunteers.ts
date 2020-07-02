import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { User } from '../../../../api/src/models/types';
import API, { getErrorResponse } from '../../api';
import {
  State, VolunteersState, RequestAction, SuccessAction, ErrorAction,
} from '../types';
import { NewVolunteer } from '../../api/types';

/*
 * Actions
 */
enum ActionsType {
  LOAD_VOLUNTEERS_REQUEST = 'volunteers/LOAD_REQUEST',
  LOAD_VOLUNTEERS_ERROR = 'volunteers/LOAD_ERROR',
  LOAD_VOLUNTEERS_SUCCESS = 'volunteers/LOAD_SUCCESS',

  CREATE_VOLUNTEER_REQUEST = 'volunteer/CREATE_REQUEST',
  CREATE_VOLUNTEER_ERROR = 'volunteer/CREATE_ERROR',
  CREATE_VOLUNTEER_SUCCESS = 'volunteer/CREATE_SUCCESS',
  CREATE_VOLUNTEER_RESET = 'volunteer/CREATE_RESET',

  UPDATE_VOLUNTEER_REQUEST = 'volunteer/UPDATE_REQUEST',
  UPDATE_VOLUNTEER_ERROR = 'volunteer/UPDATE_ERROR',
  UPDATE_VOLUNTEER_SUCCESS = 'volunteer/UPDATE_SUCCESS',
  UPDATE_VOLUNTEER_RESET = 'volunteer/UPDATE_RESET',

  DELETE_VOLUNTEER_REQUEST = 'volunteer/DELETE_REQUEST',
  DELETE_VOLUNTEER_ERROR = 'volunteer/DELETE_ERROR',
  DELETE_VOLUNTEER_SUCCESS = 'volunteer/DELETE_SUCCESS',
}

/*
 * Types
 */
type LoadVolunteersRequest = RequestAction<ActionsType.LOAD_VOLUNTEERS_REQUEST>
type LoadVolunteersSuccess = SuccessAction<ActionsType.LOAD_VOLUNTEERS_SUCCESS, User[]>
type LoadVolunteersError = ErrorAction<ActionsType.LOAD_VOLUNTEERS_ERROR>

type CreateVolunteerRequest = RequestAction<ActionsType.CREATE_VOLUNTEER_REQUEST>
type CreateVolunteerSuccess = SuccessAction<ActionsType.CREATE_VOLUNTEER_SUCCESS, User[]>
type CreateVolunteerError = ErrorAction<ActionsType.CREATE_VOLUNTEER_ERROR>
type CreateVolunteerReset = RequestAction<ActionsType.CREATE_VOLUNTEER_RESET>

type UpdateVolunteerRequest = RequestAction<ActionsType.UPDATE_VOLUNTEER_REQUEST>
type UpdateVolunteerSuccess = SuccessAction<ActionsType.UPDATE_VOLUNTEER_SUCCESS, User[]>
type UpdateVolunteerError = ErrorAction<ActionsType.UPDATE_VOLUNTEER_ERROR>
type UpdateVolunteerReset = RequestAction<ActionsType.UPDATE_VOLUNTEER_RESET>

type DeleteVolunteerRequest = RequestAction<ActionsType.DELETE_VOLUNTEER_REQUEST>
type DeleteVolunteerSuccess = SuccessAction<ActionsType.DELETE_VOLUNTEER_SUCCESS, User[]>
type DeleteVolunteerError = ErrorAction<ActionsType.DELETE_VOLUNTEER_ERROR>

type Actions
  = LoadVolunteersRequest | LoadVolunteersSuccess | LoadVolunteersError
  | CreateVolunteerRequest | CreateVolunteerSuccess | CreateVolunteerError | CreateVolunteerReset
  | UpdateVolunteerRequest | UpdateVolunteerSuccess | UpdateVolunteerError | UpdateVolunteerReset
  | DeleteVolunteerRequest | DeleteVolunteerSuccess | DeleteVolunteerError

/*
 * Initial State
 */
const initialState: VolunteersState = {
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
const loadVolunteersRequest = createAction(ActionsType.LOAD_VOLUNTEERS_REQUEST);
const loadVolunteersSuccess = createAction<Partial <User> []>(ActionsType.LOAD_VOLUNTEERS_SUCCESS);
const loadVolunteersError = createAction<Error>(ActionsType.LOAD_VOLUNTEERS_ERROR);

const createVolunteerRequest = createAction(ActionsType.CREATE_VOLUNTEER_REQUEST);
const createVolunteerSuccess = createAction(ActionsType.CREATE_VOLUNTEER_SUCCESS);
const createVolunteerError = createAction<Error>(ActionsType.CREATE_VOLUNTEER_ERROR);
export const createVolunteerReset = createAction(ActionsType.CREATE_VOLUNTEER_RESET);

const updateVolunteerRequest = createAction(ActionsType.UPDATE_VOLUNTEER_REQUEST);
const updateVolunteerSuccess = createAction(ActionsType.UPDATE_VOLUNTEER_SUCCESS);
const updateVolunteerError = createAction<Error>(ActionsType.UPDATE_VOLUNTEER_ERROR);
export const updateVolunteerReset = createAction(ActionsType.UPDATE_VOLUNTEER_RESET);

const deleteVolunteerRequest = createAction(ActionsType.DELETE_VOLUNTEER_REQUEST);
const deleteVolunteerSuccess = createAction(ActionsType.DELETE_VOLUNTEER_SUCCESS);
const deleteVolunteerError = createAction<Error>(ActionsType.DELETE_VOLUNTEER_ERROR);

/*
 * Thunk creators
 */
export const loadVolunteers = () => (dispatch) => {
  dispatch(loadVolunteersRequest());

  return API.Volunteers.get()
    .then((res) => dispatch(loadVolunteersSuccess(res.data)))
    .catch((error) => dispatch(loadVolunteersError(error)));
};

export const createVolunteer = (user: Partial<NewVolunteer>) => (dispatch, getState) => {
  dispatch(createVolunteerRequest());
  const state = getState();
  const volunteer = {
    organisationId: state.currentUser.data.organisationId,
    ...user,
  };

  return API.Volunteers.add(volunteer)
    .then(() => {
      dispatch(createVolunteerSuccess());
      dispatch(loadVolunteers());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(createVolunteerError(errorResponse));
    });
};

export const updateVolunteer = (changeset) => (dispatch) => {
  dispatch(updateVolunteerRequest());

  return API.Volunteers.update(changeset)
    .then(() => {
      dispatch(updateVolunteerSuccess());
      dispatch(loadVolunteers());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(updateVolunteerError(errorResponse));
    });
};

export const deleteVolunteer = (id: number) => (dispatch) => {
  dispatch(deleteVolunteerRequest());

  return API.Volunteers.delete(id)
    .then(() => {
      dispatch(deleteVolunteerSuccess());
      dispatch(loadVolunteers());
    })
    .catch((error) => dispatch(deleteVolunteerError(error)));
};

/*
 * Reducer
 */
const volunteersReducer: Reducer<VolunteersState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    // LOAD
    case ActionsType.LOAD_VOLUNTEERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ActionsType.LOAD_VOLUNTEERS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case ActionsType.LOAD_VOLUNTEERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchError: null,
        lastUpdated: new Date(),
        order: action.payload.map((log) => log.id),
        items: action.payload.reduce(
          (acc, volunteer) => ({ ...acc, [volunteer.id]: volunteer }),
          {},
        ),
      };

    // CREATE
    case ActionsType.CREATE_VOLUNTEER_REQUEST:
      return {
        ...state,
        createIsFetching: true,
        createSuccess: false,
      };

    case ActionsType.CREATE_VOLUNTEER_ERROR:
      return {
        ...state,
        createIsFetching: false,
        createSuccess: false,
        createError: action.payload,
      };

    case ActionsType.CREATE_VOLUNTEER_SUCCESS:
      return {
        ...state,
        createIsFetching: false,
        createSuccess: true,
        createError: null,
      };

    case ActionsType.CREATE_VOLUNTEER_RESET:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: false,
      };

    // UPDATE
    case ActionsType.UPDATE_VOLUNTEER_REQUEST:
      return {
        ...state,
        updateIsFetching: true,
        updateSuccess: false,
      };

    case ActionsType.UPDATE_VOLUNTEER_ERROR:
      return {
        ...state,
        updateIsFetching: false,
        updateError: action.payload,
        updateSuccess: false,
      };

    case ActionsType.UPDATE_VOLUNTEER_SUCCESS:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: true,
      };

    case ActionsType.UPDATE_VOLUNTEER_RESET:
      return {
        ...state,
        updateIsFetching: false,
        updateError: null,
        updateSuccess: false,
      };

    // DELETE
    case ActionsType.DELETE_VOLUNTEER_REQUEST:
      return {
        ...state,
        deleteIsFetching: true,
      };

    case ActionsType.DELETE_VOLUNTEER_ERROR:
      return {
        ...state,
        deleteIsFetching: false,
        deleteError: action.payload,
      };

    case ActionsType.DELETE_VOLUNTEER_SUCCESS:
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

export const selectVolunteers = (state: State) => state.entities.volunteers.items;

export const selectOrderedVolunteers = (state: State) => state.entities.volunteers.order
  .map((id) => state.entities.volunteers.items[id]);

export const selectVolunteersStatus = ({ entities: { volunteers } }: State) => (
  { isFetching: volunteers.isFetching, error: volunteers.fetchError }
);

export const selectCreateVolunteerStatus = ({ entities: { volunteers } }: State) => ({
  isFetching: volunteers.createIsFetching,
  error: volunteers.createError,
  success: volunteers.createSuccess,
});

export const selectUpdateVolunteerStatus = ({ entities: { volunteers } }: State) => ({
  isFetching: volunteers.updateIsFetching,
  error: volunteers.updateError,
  success: volunteers.updateSuccess,
});

export const selectDeleteVolunteerStatus = ({ entities: { volunteers } }: State) => (
  { isFetching: volunteers.deleteIsFetching, error: volunteers.deleteError }
);


export default volunteersReducer;
