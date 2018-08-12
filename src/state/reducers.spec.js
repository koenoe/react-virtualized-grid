// @flow

import moviesReducer from 'state/movies/reducer';
import { configureStore } from 'state/configureStore';

import type { MoviesAction } from 'state/movies/actions';
import type { Store } from 'state/configureStore';

describe('Reducers', () => {
  const store: Store = configureStore();

  it('should delegate a `movies` action to the `movies` reducer', () => {
    const action: MoviesAction = {
      type: 'movies/FETCH_MOVIES_REQUEST',
    };
    store.dispatch(action);

    expect(store.getState().movies).toEqual(
      moviesReducer(
        {
          isLoading: true,
          error: null,
          items: [],
          currentPage: 0,
          totalNumberOfItems: 0,
          totalNumberOfPages: 0,
        },
        action,
      ),
    );
  });
});
