import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { VolunteerActivity } from '../../../../api/src/models/types'; // TODO
import Api from '../../api';
import {
  State, RegionsState, RequestAction, SuccessAction, ErrorAction,
} from '../types';


/*
 * Actions
 */
enum ActionsType {
 LOAD_REGIONS_REQUEST = 'regions/LOAD_REQUEST',
 LOAD_REGIONS_ERROR = 'regions/LOAD_ERROR',
 LOAD_REGIONS_SUCCESS = 'regions/LOAD_SUCCESS',
}

/*
 * Types
 */

type LoadRegionsRequest = RequestAction<ActionsType.LOAD_REGIONS_REQUEST>
type LoadRegionsSuccess = SuccessAction<ActionsType.LOAD_REGIONS_SUCCESS, VolunteerActivity[]>
type LoadRegionsError = ErrorAction<ActionsType.LOAD_REGIONS_ERROR>

type Actions = LoadRegionsRequest | LoadRegionsError | LoadRegionsSuccess

/*
* Initial State
*/
const initialState: RegionsState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
};


/*
 * Action creators
 */
const loadRegionsRequest = createAction(ActionsType.LOAD_REGIONS_REQUEST);
const loadRegionsError = createAction<Error>(ActionsType.LOAD_REGIONS_ERROR);
const loadRegionsSuccess = createAction<Partial <VolunteerActivity> []>(ActionsType.LOAD_REGIONS_SUCCESS); //eslint-disable-line


/*
 * Thunk creators
 */
export const loadRegions = () => (dispatch) => {
  dispatch(loadRegionsRequest());

  return Api.Constants.regions() // TODO
    .then((res) => dispatch(loadRegionsSuccess(res.data)))
    .catch((error) => dispatch(loadRegionsError(error)));
};

/*
 * Reducer
 */
const regionsReducer: Reducer<RegionsState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.LOAD_REGIONS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ActionsType.LOAD_REGIONS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case ActionsType.LOAD_REGIONS_SUCCESS:
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
export const selectOrderedRegions = (state: State) => state.constants.regions.order
  .map((id) => state.constants.regions.items[id]);

export const selectRegionsStatus = ({ constants: { regions } }: State) => (
  { isFetching: regions.isFetching, error: regions.fetchError }
);

export default regionsReducer;
