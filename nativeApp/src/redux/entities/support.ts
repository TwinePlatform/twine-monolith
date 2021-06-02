import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import {
  State,
  SupportState
} from '../types'; // TODO


/*
 * Actions
 */
enum ActionsType {
  OPEN_SUPPORT_MODAL = 'support/OPEN_MODAL',
  CLOSE_SUPPORT_MODAL = 'support/CLOSE_MODAL',
}

/*
 * Types
 */
type OpenSupportModal = {
  type: ActionsType.OPEN_SUPPORT_MODAL;
};

type CloseSupportModal = {
  type: ActionsType.CLOSE_SUPPORT_MODAL;
};

type Actions = OpenSupportModal| CloseSupportModal;

/*
* Initial State
*/

const initialState: SupportState = {
  modalOpen: false,
};

/*
 * Action creators
 */
const openSupportModal = createAction(ActionsType.OPEN_SUPPORT_MODAL);
const closeSupportModal = createAction(ActionsType.CLOSE_SUPPORT_MODAL);

/*
 * Thunk creators
 */
export const openModal = () => (dispatch) => {
  dispatch(openSupportModal());
};

export const closeModal = () => (dispatch) => {
    dispatch(closeSupportModal());
};

/*
 * Reducer
 */
const supportReducer: Reducer<SupportState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.OPEN_SUPPORT_MODAL:
      return {
        ...state,
        modalOpen: true,
      };

    case ActionsType.CLOSE_SUPPORT_MODAL:
      return {
        ...state,
        modalOpen: false,
      };
    default:
      return state;
  }
};


/*
 * Selectors
 */

export const selectModalStatus = ({ entities: { support } }: State) => (
  { modalOpen: support.modalOpen}
);

export default supportReducer;
