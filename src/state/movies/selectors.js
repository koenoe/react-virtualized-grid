// @flow
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import type { State } from 'state/reducers';

export const moviesState = (state: State) => state.movies;

export const isLoading = createSelector([moviesState], state => state.isLoading);

export const movies = createSelector([moviesState], state => state.items);

export const movieIds = createSelector(
  [movies],
  items => (items ? items.map(item => item.id) : []),
);

export const movie = createCachedSelector(
  movies,
  (state, movieId) => movieId,
  (selectedMovies, selectedMovieId) => selectedMovies.find(m => m.id === selectedMovieId),
)((state, selectedMovieId) => selectedMovieId);
