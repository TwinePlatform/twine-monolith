import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { User } from '../../../../api/src/models/types';
import API from '../../api';
import {
  State, VolunteersState, RequestAction, SuccessAction, ErrorAction,
} from '../types';

/*
 * Actions
 */
enum ActionsType {
  LOAD_VOLUNTEERS_REQUEST = 'volunteers/LOAD_REQUEST',
  LOAD_VOLUNTEERS_ERROR = 'volunteers/LOAD_ERROR',
  LOAD_VOLUNTEERS_SUCCESS = 'volunteers/LOAD_SUCCESS',

  UPDATE_VOLUNTEER_REQUEST = 'volunteer/UPDATE_REQUEST',
  UPDATE_VOLUNTEER_ERROR = 'volunteer/UPDATE_ERROR',
  UPDATE_VOLUNTEER_SUCCESS = 'volunteer/UPDATE_SUCCESS',
}

/*
 * Types
 */
type LoadVolunteersRequest = RequestAction<ActionsType.LOAD_VOLUNTEERS_REQUEST>
type LoadVolunteersSuccess = SuccessAction<ActionsType.LOAD_VOLUNTEERS_REQUEST, User[]>
type LoadVolunteersError = ErrorAction<ActionsType.LOAD_VOLUNTEERS_ERROR>

type Actions = LoadVolunteersRequest | LoadVolunteersError | LoadVolunteersSuccess

/*
 * Initial State
 */
const initialState: VolunteersState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
};

/*
 * Action creators
 */
const loadVolunteersRequest = createAction(ActionsType.LOAD_VOLUNTEERS_REQUEST);
const loadVolunteersError = createAction<Error>(ActionsType.LOAD_VOLUNTEERS_ERROR);
const loadVolunteersSuccess = createAction<Partial <User> []>(ActionsType.LOAD_VOLUNTEERS_SUCCESS);

/*
 * Thunk creators
 */
export const loadVolunteers = () => (dispatch) => {
  dispatch(loadVolunteersRequest());

  return API.Volunteers.get()
    .then((res) => dispatch(loadVolunteersSuccess(res.data)))
    .catch((error) => dispatch(loadVolunteersError(error)));
};

/*
 * Reducer
 */
const volunteersReducer: Reducer<VolunteersState, Actions> = (state = initialState, action) => {
  switch (action.type) {
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

export default volunteersReducer;
