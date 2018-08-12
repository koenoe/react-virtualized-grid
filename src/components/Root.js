// @flow
import React, { Fragment } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import type { Store } from 'redux';
import type { BrowserHistory } from 'history/createBrowserHistory';

import Home from 'containers/Home';

type Props = {
  store: Store<any, any>, // FIXME: State, Action
  history: BrowserHistory,
};

export default ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Fragment>
        <Route exact path="/" component={Home} />
      </Fragment>
    </ConnectedRouter>
  </Provider>
);
