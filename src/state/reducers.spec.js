// @flow
import { routerReducer } from 'react-router-redux';

import { configureStore } from 'state/configureStore';

import type { Store } from 'state/configureStore';

describe('Reducers', () => {
  const store: Store = configureStore();

  it('should delegate a `routing` action to the `routerReducer` reducer', () => {
    const action: any = {
      type: '@@router/LOCATION_CHANGE',
      location: {
        pathname: '/',
        search: '',
        hash: '',
      },
    };
    store.dispatch(action);

    expect(store.getState().routing)
      .toEqual(routerReducer(undefined, action));
  });
});
