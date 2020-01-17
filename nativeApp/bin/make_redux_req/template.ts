import { capitaliseFirst, capitalise } from '../utils';


export default (entity: string) => `import { Reducer } from 'redux';
import { createAction } from 'redux-actions';
import {  } from '../../../../api/src/models/types'; //TODO 
import {  } from '../../api'; //TODO
import { State, ${capitaliseFirst(entity)}State, RequestAction, SuccessAction, ErrorAction  } from '../types'; //TODO


/*
 * Actions
 */
enum ActionsType {
 LOAD_${capitalise(entity)}_REQUEST = '${entity}/LOAD_REQUEST',
 LOAD_${capitalise(entity)}_ERROR = '${entity}/LOAD_ERROR',
 LOAD_${capitalise(entity)}_SUCCESS = '${entity}/LOAD_SUCCESS',
}

/*
 * Types
 */

type Load${capitaliseFirst(entity)}Request = RequestAction<ActionsType.LOAD_${capitalise(entity)}_REQUEST>
type Load${capitaliseFirst(entity)}Success = SuccessAction<ActionsType.LOAD_${capitalise(entity)}_SUCCESS, TODO[]>
type Load${capitaliseFirst(entity)}Error = ErrorAction<ActionsType.LOAD_${capitalise(entity)}_ERROR>

type Actions = Load${capitaliseFirst(entity)}Request | Load${capitaliseFirst(entity)}Error | Load${capitaliseFirst(entity)}Success

/*
* Initial State
*/
const initialState: ${capitaliseFirst(entity)}State = {
 fetchError: null,
 isFetching: false,
 lastUpdated: null,
 items: {},
 order: [],
};


/*
 * Action creators
 */
const load${capitaliseFirst(entity)}Request = createAction(ActionsType.LOAD_${capitalise(entity)}_REQUEST);
const load${capitaliseFirst(entity)}Error = createAction<Error>(ActionsType.LOAD_${capitalise(entity)}_ERROR);
const load${capitaliseFirst(entity)}Success = createAction<Partial <TODO> []>(ActionsType.LOAD_${capitalise(entity)}_SUCCESS);


/*
 * Thunk creators
 */
export const load${capitaliseFirst(entity)} = () => (dispatch) => {
 dispatch(load${capitaliseFirst(entity)}Request());

 return REQUEST() //TODO
   .then((res) => dispatch(load${capitaliseFirst(entity)}Success(res.data)))
   .catch((error) => dispatch(load${capitaliseFirst(entity)}Error(error)));
};

/*
 * Reducer
 */
const ${entity}Reducer: Reducer<${capitaliseFirst(entity)}State, Actions> = (state = initialState, action) => {
 switch (action.type) {
   case ActionsType.LOAD_${capitalise(entity)}_REQUEST:
     return {
       ...state,
       isFetching: true,
     };

   case ActionsType.LOAD_${capitalise(entity)}_ERROR:
     return {
       ...state,
       isFetching: false,
       fetchError: action.payload,
     };

   case ActionsType.LOAD_${capitalise(entity)}_SUCCESS:
     return {
       ...state,
       isFetching: false,
       fetchError: null,
       lastUpdated: new Date(),
       order: action.payload.map((log) => log.id),
       items: action.payload.reduce((acc, x) => ({ ...acc, [x.id]: x }),{}),
     };

   default:
     return state;
 }
};


/*
 * Selectors
 */
export const selectOrdered${capitaliseFirst(entity)} = (state: State) => state.entities.${entity}.order
 .map((id) => state.entities.${entity}.items[id]);

export const select${capitaliseFirst(entity)}Status = ({ entities: { ${entity} } }: State) => (
 { isFetching: ${entity}.isFetching, error: ${entity}.fetchError }
);

export default ${entity}Reducer;

`;
