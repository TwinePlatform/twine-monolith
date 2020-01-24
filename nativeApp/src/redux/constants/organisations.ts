import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import { VolunteerActivity } from '../../../../api/src/models/types'; // TODO
import Api from '../../api';
import {
  State, OrganisationsState, RequestAction, SuccessAction, ErrorAction,
} from '../types';


/*
 * Actions
 */
enum ActionsType {
 LOAD_ORGANISATIONS_REQUEST = 'organisations/LOAD_REQUEST',
 LOAD_ORGANISATIONS_ERROR = 'organisations/LOAD_ERROR',
 LOAD_ORGANISATIONS_SUCCESS = 'organisations/LOAD_SUCCESS',
}

/*
 * Types
 */

type LoadOrganisationsRequest = RequestAction<ActionsType.LOAD_ORGANISATIONS_REQUEST>
type LoadOrganisationsSuccess = SuccessAction<ActionsType.LOAD_ORGANISATIONS_SUCCESS, VolunteerActivity[]>
type LoadOrganisationsError = ErrorAction<ActionsType.LOAD_ORGANISATIONS_ERROR>

type Actions = LoadOrganisationsRequest | LoadOrganisationsError | LoadOrganisationsSuccess

/*
* Initial State
*/
const initialState: OrganisationsState = {
  fetchError: null,
  isFetching: false,
  lastUpdated: null,
  items: {},
  order: [],
};


/*
 * Action creators
 */
const loadOrganisationsRequest = createAction(ActionsType.LOAD_ORGANISATIONS_REQUEST);
const loadOrganisationsError = createAction<Error>(ActionsType.LOAD_ORGANISATIONS_ERROR);
const loadOrganisationsSuccess = createAction<Partial <VolunteerActivity> []>(ActionsType.LOAD_ORGANISATIONS_SUCCESS); //eslint-disable-line


/*
 * Thunk creators
 */
export const loadOrganisations = (regionId: number) => (dispatch) => {
  dispatch(loadOrganisationsRequest());

  return Api.Constants.organisations(regionId) // TODO
    .then((res) => dispatch(loadOrganisationsSuccess(res.data)))
    .catch((error) => dispatch(loadOrganisationsError(error)));
};

/*
 * Reducer
 */
const organisationsReducer: Reducer<OrganisationsState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.LOAD_ORGANISATIONS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ActionsType.LOAD_ORGANISATIONS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };

    case ActionsType.LOAD_ORGANISATIONS_SUCCESS:
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
export const selectOrderedOrganisations = (state: State) => state.constants.organisations.order
  .map((id) => state.constants.organisations.items[id]);

export const selectOrganisationsStatus = ({ constants: { organisations } }: State) => (
  { isFetching: organisations.isFetching, error: organisations.fetchError }
);

export default organisationsReducer;
