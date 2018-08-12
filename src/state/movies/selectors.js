// @flow
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import type { State } from 'state/reducers';

export const moviesState = (state: State) => state.movies;

export const movies = createSelector([moviesState], state => state.items);

export const movie = createCachedSelector(
  movies,
  (state, movieId) => movieId,
  (selectedMovies, selectedMovieId) =>
    selectedMovies.find(m => m.id === selectedMovieId),
)((state, selectedMovieId) => selectedMovieId);
