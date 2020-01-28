import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import {
  State, CurrentUserState, RequestAction, SuccessAction, ErrorAction,
} from './types';
import API, { getErrorResponse } from '../api';
import { CurrentUser, Roles } from '../api/types';


/*
 * Actions
 */
enum ActionsType {
  LOAD_ROLES_REQUEST = 'roles/LOAD_REQUEST',
  LOAD_ROLES_ERROR = 'roles/LOAD_ERROR',
  LOAD_ROLES_SUCCESS = 'roles/LOAD_SUCCESS',

  LOAD_CURRENT_USER_REQUEST = 'currentUser/LOAD_REQUEST',
  LOAD_CURRENT_USER_ERROR = 'currentUser/LOAD_ERROR',
  LOAD_CURRENT_USER_SUCCESS = 'currentUser/LOAD_SUCCESS',
}

/*
 * Types
 */
type LoadRolesRequest = RequestAction<ActionsType.LOAD_ROLES_REQUEST>
type LoadRolesSuccess = SuccessAction<ActionsType.LOAD_ROLES_SUCCESS, Roles>
type LoadRolesError = ErrorAction<ActionsType.LOAD_ROLES_ERROR>

type LoadCurrentUserRequest = RequestAction<ActionsType.LOAD_CURRENT_USER_REQUEST>
type LoadCurrentUserSuccess = SuccessAction<ActionsType.LOAD_CURRENT_USER_SUCCESS, CurrentUser>
type LoadCurrentUserError = ErrorAction<ActionsType.LOAD_CURRENT_USER_ERROR>


type Actions = LoadRolesRequest | LoadRolesSuccess | LoadRolesError
  | LoadCurrentUserRequest | LoadCurrentUserSuccess | LoadCurrentUserError

/*
* Initial State
*/
const initialState: CurrentUserState = {
  rolesFetchError: null,
  rolesIsFetching: false,
  rolesSuccess: false,
  roles: null,
  organisationId: null,
  currentUser: null,
};

/*
 * Action creators
 */
const loadRolesRequest = createAction(ActionsType.LOAD_ROLES_REQUEST);
const loadRolesSuccess = createAction<Partial <Roles> >(ActionsType.LOAD_ROLES_SUCCESS);
const loadRolesError = createAction<Error>(ActionsType.LOAD_ROLES_ERROR);

const loadCurrentUserRequest = createAction(ActionsType.LOAD_CURRENT_USER_REQUEST);
const loadCurrentUserSuccess = createAction<Partial <CurrentUser> >(ActionsType.LOAD_CURRENT_USER_SUCCESS); //eslint-disable-line
const loadCurrentUserError = createAction<Error>(ActionsType.LOAD_CURRENT_USER_ERROR);

/*
 * Thunk creators
 */
export const loadCurrentUser = () => (dispatch) => {
  dispatch(loadCurrentUserRequest());

  return API.Authentication.me()
    .then((res) => {
      dispatch(loadCurrentUserSuccess(res.data));
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(loadCurrentUserError(errorResponse));
    });
};

export const loadRoles = () => (dispatch) => {
  dispatch(loadRolesRequest());

  return API.Authentication.roles()
    .then((res) => {
      dispatch(loadRolesSuccess(res.data));
      dispatch(loadCurrentUser());
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(loadRolesError(errorResponse));
    });
};

/*
 * Reducer
 */
const currentUserReducer: Reducer<CurrentUserState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    // LOAD ROLES
    case ActionsType.LOAD_ROLES_REQUEST:
      return {
        ...state,
        rolesIsFetching: true,
      };

    case ActionsType.LOAD_ROLES_ERROR:
      return {
        ...state,
        rolesIsFetching: false,
        rolesFetchError: action.payload,
      };

    case ActionsType.LOAD_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.payload.roles,
        organisationId: action.payload.organisationId,
        rolesFetchError: false,
        rolesSuccess: true,
      };

    // LOAD CURRENT USER
    case ActionsType.LOAD_CURRENT_USER_REQUEST:
      return {
        ...state,
        currentUserIsFetching: true,
      };

    case ActionsType.LOAD_CURRENT_USER_ERROR:
      return {
        ...state,
        currentUserIsFetching: false,
        currentUserIsFetchError: action.payload,
      };

    case ActionsType.LOAD_CURRENT_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
      };

    default:
      return state;
  }
};


/*
 * Selectors
 */
export const selectCurrentUser = ({ currentUser }: State) => currentUser.currentUser;

export const selectRoles = ({ currentUser }: State) => currentUser.roles;

export const selectRolesStatus = ({ currentUser }: State) => ({
  isFetching: currentUser.rolesIsFetching,
  error: currentUser.rolesFetchError,
  success: currentUser.rolesSuccess,
});

export default currentUserReducer;
