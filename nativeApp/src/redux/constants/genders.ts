import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { VolunteerActivity } from '../../../../api/src/models/types'; // TODO
import Api from '../../api';
import {
  State, GendersState, RequestAction, SuccessAction, ErrorAction,
} from '../types';


/*
 * Actions
 */
enum ActionsType {
 LOAD_GENDERS_REQUEST = 'genders/LOAD_REQUEST',
 LOAD_GENDERS_ERROR = 'genders/LOAD_ERROR',
 LOAD_GENDERS_SUCCESS = 'genders/LOAD_SUCCESS',
}

/*
 * Types
 */

type LoadGendersRequest = RequestAction<ActionsType.LOAD_GENDERS_REQUEST>
type LoadGendersSuccess = SuccessAction<ActionsType.LOAD_GENDERS_SUCCESS, VolunteerActivity[]>
type LoadGendersError = ErrorAction<ActionsType.LOAD_GENDERS_ERROR>

type Actions = LoadGendersRequest | LoadGendersError | LoadGendersSuccess

/*
* Initial State
*/
const initialState: GendersState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
};


/*
 * Action creators
 */
const loadGendersRequest = createAction(ActionsType.LOAD_GENDERS_REQUEST);
const loadGendersError = createAction<Error>(ActionsType.LOAD_GENDERS_ERROR);
const loadGendersSuccess = createAction<Partial <VolunteerActivity> []>(ActionsType.LOAD_GENDERS_SUCCESS); //eslint-disable-line


/*
 * Thunk creators
 */
export const loadGenders = () => (dispatch) => {
  dispatch(loadGendersRequest());

  return Api.Constants.genders() // TODO
    .then((res) => dispatch(loadGendersSuccess(res.data)))
    .catch((error) => dispatch(loadGendersError(error)));
};

/*
 * Reducer
 */
const gendersReducer: Reducer<GendersState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.LOAD_GENDERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ActionsType.LOAD_GENDERS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case ActionsType.LOAD_GENDERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchError: null,
        lastUpdated: new Date(),
        order: action.payload.map((log) => log.id),
        items: action.payload.reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
      };

    default:
      return state;
  }
};


/*
 * Selectors
 */
export const selectOrderedGenders = (state: State) => state.constants.genders.order
  .map((id) => state.constants.genders.items[id]);

export const selectGendersStatus = ({ constants: { genders } }: State) => (
  { isFetching: genders.isFetching, error: genders.fetchError }
);

export default gendersReducer;
