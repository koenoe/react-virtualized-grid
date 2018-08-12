// @flow
import { callApi } from 'utils/api';

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
  currentPage: number,
  totalNumberOfItems: number,
  totalNumberOfPages: number,
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

const fetchMoviesSuccess = (payload: any): FetchMoviesSuccessAction => ({
  type: FETCH_MOVIES_SUCCESS,
  items: payload.results || [],
  currentPage: payload.page || 0,
  totalNumberOfItems: payload.total_results || 0,
  totalNumberOfPages: payload.total_pages || 0,
});

export const fetchMovies = (page?: number = 1): ThunkAction => async (dispatch: Dispatch) => {
  dispatch(fetchMoviesRequest());
  try {
    // $FlowFixMe
    const { result } = await callApi(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&page=${page}`);
    dispatch(fetchMoviesSuccess(result));
  } catch (error) {
    dispatch(fetchMoviesFailure(error));
  }
};
