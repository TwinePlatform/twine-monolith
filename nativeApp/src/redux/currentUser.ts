import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { State, CurrentUserState } from './types';
import { CurrentUser } from '../api/types';


/*
 * Actions
 */
enum ActionsType {
 UPDATE_CURRENT_USER = 'currentUser/UPDATE',
}

/*
 * Types
 */
type UpdateCurrentUser = {
 type: ActionsType.UPDATE_CURRENT_USER;
 payload: CurrentUser;
};


type Actions = UpdateCurrentUser

/*
* Initial State
*/
const initialState: CurrentUserState = null;


/*
 * Action creators
 */
export const updateCurrentUser = createAction(ActionsType.UPDATE_CURRENT_USER);


/*
 * Reducer
 */
const currentUserReducer: Reducer<CurrentUserState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.UPDATE_CURRENT_USER:
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};


/*
 * Selectors
 */
export const selectCurrentUser = (state: State) => state.currentUser.data;

export default currentUserReducer;
