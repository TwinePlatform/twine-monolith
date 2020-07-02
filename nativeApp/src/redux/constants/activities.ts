import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { VolunteerActivity } from '../../../../api/src/models/types'; // TODO
import Api from '../../api';
import {
  State, ActivitiesState, RequestAction, SuccessAction, ErrorAction,
} from '../types'; // TODO


/*
 * Actions
 */
enum ActionsType {
 LOAD_ACTIVITIES_REQUEST = 'activities/LOAD_REQUEST',
 LOAD_ACTIVITIES_ERROR = 'activities/LOAD_ERROR',
 LOAD_ACTIVITIES_SUCCESS = 'activities/LOAD_SUCCESS',
}

/*
 * Types
 */

type LoadActivitiesRequest = RequestAction<ActionsType.LOAD_ACTIVITIES_REQUEST>
type LoadActivitiesSuccess = SuccessAction<ActionsType.LOAD_ACTIVITIES_SUCCESS, VolunteerActivity[]>
type LoadActivitiesError = ErrorAction<ActionsType.LOAD_ACTIVITIES_ERROR>

type Actions = LoadActivitiesRequest | LoadActivitiesError | LoadActivitiesSuccess

/*
* Initial State
*/
const initialState: ActivitiesState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
};


/*
 * Action creators
 */
const loadActivitiesRequest = createAction(ActionsType.LOAD_ACTIVITIES_REQUEST);
const loadActivitiesError = createAction<Error>(ActionsType.LOAD_ACTIVITIES_ERROR);
const loadActivitiesSuccess = createAction<Partial <VolunteerActivity> []>(ActionsType.LOAD_ACTIVITIES_SUCCESS); //eslint-disable-line


/*
 * Thunk creators
 */
export const loadActivities = () => (dispatch) => {
  dispatch(loadActivitiesRequest());

  return Api.Constants.activities() // TODO
    .then((res) => dispatch(loadActivitiesSuccess(res.data)))
    .catch((error) => dispatch(loadActivitiesError(error)));
};

/*
 * Reducer
 */
const activitiesReducer: Reducer<ActivitiesState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.LOAD_ACTIVITIES_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ActionsType.LOAD_ACTIVITIES_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case ActionsType.LOAD_ACTIVITIES_SUCCESS:
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
export const selectOrderedActivities = (state: State) => state.constants.activities.order
  .map((id) => state.constants.activities.items[id]);

export const selectActivitiesStatus = ({ constants: { activities } }: State) => (
  { isFetching: activities.isFetching, error: activities.fetchError }
);

export default activitiesReducer;
