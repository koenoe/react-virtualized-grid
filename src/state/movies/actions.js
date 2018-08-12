// @flow
import type { Dispatch as ReduxDispatch } from 'redux';

type FetchMoviesRequestAction = {|
  type: 'movies/FETCH_MOVIES_REQUEST',
|};

type FetchMoviesFailureAction = {|
  type: 'movies/FETCH_MOVIES_FAILURE',
  error: any,
|};

type FetchMoviesSuccessAction = {|
  type: 'movies/FETCH_MOVIES_SUCCESS',
  items: Array<Object>,
|};

export type MoviesAction =
  | FetchMoviesRequestAction
  | FetchMoviesFailureAction
  | FetchMoviesSuccessAction;

type Dispatch = ReduxDispatch<MoviesAction>;
type ThunkAction = (dispatch: Dispatch) => any;

export const FETCH_MOVIES_REQUEST: 'movies/FETCH_MOVIES_REQUEST' = 'movies/FETCH_MOVIES_REQUEST';
export const FETCH_MOVIES_FAILURE: 'movies/FETCH_MOVIES_FAILURE' = 'movies/FETCH_MOVIES_FAILURE';
export const FETCH_MOVIES_SUCCESS: 'movies/FETCH_MOVIES_SUCCESS' = 'movies/FETCH_MOVIES_SUCCESS';

const fetchMoviesRequest = (): FetchMoviesRequestAction => ({
  type: FETCH_MOVIES_REQUEST,
});

const fetchMoviesFailure = (error: any): FetchMoviesFailureAction => ({
  type: FETCH_MOVIES_FAILURE,
  error,
});

const fetchMoviesSuccess = (items: Array<Object>): FetchMoviesSuccessAction => ({
  type: FETCH_MOVIES_SUCCESS,
  items,
});

export const fetchMovies = (): ThunkAction => async (dispatch: Dispatch) => {
  dispatch(fetchMoviesRequest());
  try {
    // api call here
    dispatch(fetchMoviesSuccess([
      { foo: 'bar' },
      { foo: 'bar' },
      { foo: 'bar' },
      { foo: 'bar' },
      { foo: 'bar' },
      { foo: 'bar' },
    ]));
  } catch (error) {
    dispatch(fetchMoviesFailure(error));
  }
};
