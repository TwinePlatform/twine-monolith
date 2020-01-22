import { Reducer } from 'redux';
import { State, BirthYearsState } from '../types';

// NB: Stored in redux incase values moved to api

/*
 * Actions
 */

/*
 * Types
 */

/*
 * Initial State
 */

const birthYears = [...Array(100).keys()].map((_, i) => ({ id: i, name: `${2019 - i + 14}` }));

const initialState: BirthYearsState = {
  items: birthYears.reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
  order: birthYears.map((log) => log.id),
};


/*
 * Action creators
 */

/*
 * Thunk creators
 */

/*
 * Reducer
 */
const birthYearsReducer: Reducer<BirthYearsState> = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};


/*
 * Selectors
 */
export const selectOrderedBirthYears = (state: State) => state.constants.birthYears.order
  .map((id) => state.constants.birthYears.items[id]);

export default birthYearsReducer;
