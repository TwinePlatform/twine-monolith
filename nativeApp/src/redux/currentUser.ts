import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import {
  State, CurrentUserState, RequestAction, SuccessAction, ErrorAction, CurrentUserData,
} from './types';
import API, { getErrorResponse } from '../api';
import { CurrentUser, Roles } from '../api/types';


/*
 * Actions
 */
enum ActionsType {
  LOAD_CURRENT_USER_REQUEST = 'currentUser/LOAD_REQUEST',
  LOAD_CURRENT_USER_ERROR = 'currentUser/LOAD_ERROR',
  LOAD_CURRENT_USER_SUCCESS = 'currentUser/LOAD_SUCCESS',
}

/*
 * Types
 */

type LoadCurrentUserRequest = RequestAction<ActionsType.LOAD_CURRENT_USER_REQUEST>
type LoadCurrentUserSuccess = SuccessAction<ActionsType.LOAD_CURRENT_USER_SUCCESS, CurrentUser>
type LoadCurrentUserError = ErrorAction<ActionsType.LOAD_CURRENT_USER_ERROR>


type Actions = LoadCurrentUserRequest | LoadCurrentUserSuccess | LoadCurrentUserError

/*
* Initial State
*/
const initialState: CurrentUserState = {
  currentUserFetchError: null,
  currentUserIsFetching: false,
  currentUserSuccess: false,
  roles: null,
  organisationId: null,
  currentUser: null,
};

/*
 * Action creators
 */
const loadCurrentUserRequest = createAction(ActionsType.LOAD_CURRENT_USER_REQUEST);
const loadCurrentUserSuccess = createAction<CurrentUserData >(ActionsType.LOAD_CURRENT_USER_SUCCESS); //eslint-disable-line
const loadCurrentUserError = createAction<Error>(ActionsType.LOAD_CURRENT_USER_ERROR);

/*
 * Thunk creators
 */
export const loadCurrentUser = (roles: Roles) => (dispatch) => {
  dispatch(loadCurrentUserRequest());

  return API.Authentication.me()
    .then((res) => {
      dispatch(loadCurrentUserSuccess({
        roles: roles.roles,
        organisationId: roles.organisationId,
        currentUser: res.data,
      }));
    })
    .catch((error) => {
      const errorResponse = getErrorResponse(error);
      dispatch(loadCurrentUserError(errorResponse));
    });
};

/*
 * Reducer
 */
const currentUserReducer: Reducer<CurrentUserState, Actions> = (state = initialState, action) => {
  switch (action.type) {
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


export default currentUserReducer;
