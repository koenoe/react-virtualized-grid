// @flow
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const reducers: any = combineReducers({
  routing: routerReducer,
});

export default reducers;

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;
type Reducers = typeof reducers;
export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;
