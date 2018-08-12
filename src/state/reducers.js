// @flow
import { combineReducers } from 'redux';

import moviesReducer from 'state/movies/reducer';

const reducers: any = combineReducers({
  movies: moviesReducer,
});

export default reducers;

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;
type Reducers = typeof reducers;
export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;
