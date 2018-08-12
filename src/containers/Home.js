// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchMovies as fetchMoviesAction } from 'state/movies/actions';
import * as movieSelectors from 'state/movies/selectors';
import Grid from 'components/Grid';

import type { ComponentType } from 'react';

type OwnProps = {|
  movies: Array<Object>,
|};

type DispatchProps = {|
  fetchMovies: () => void,
|};

type Props = {| ...OwnProps, ...DispatchProps |};

type State = {||}

export const mapStateToProps: State => OwnProps = createSelector(
  movieSelectors.movies,
  movies => ({
    movies,
  }),
);

const mapDispatchToProps = (dispatch: Dispatch<*>): DispatchProps => ({
  fetchMovies: () => dispatch(fetchMoviesAction()),
});

class Home extends PureComponent<Props, State> {
  state: State;
  foo: string;

  constructor(props: Props) {
    super(props);

    this.foo = 'bar';
  }

  componentDidMount() {
    const { fetchMovies } = this.props;
    fetchMovies();
  }

  render() {
    const { movies } = this.props;
    return (
      <Fragment>
        <h1>Welcome to the homepage</h1>
        {movies && (
          <p>Movies total: {movies.length}</p>
        )}
        <Grid />
      </Fragment>
    );
  }
}

export default (
  connect(mapStateToProps, mapDispatchToProps)(Home): ComponentType<*>
);
