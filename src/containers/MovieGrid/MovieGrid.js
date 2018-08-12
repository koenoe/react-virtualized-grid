// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchMovies as fetchMoviesAction } from 'state/movies/actions';
import * as movieSelectors from 'state/movies/selectors';
import Grid from 'components/Grid';
import MovieCell from 'containers/MovieCell';

import type { ComponentType } from 'react';

type OwnProps = {||};

type OutProps = {|
  movieIds: Array<number>,
  isLoading: boolean,
|};

type DispatchProps = {|
  fetchMovies: () => void,
|};

type Props = {| ...OwnProps, ...OutProps, ...DispatchProps |};

type State = {||};

export const mapStateToProps: State => OutProps = createSelector(
  movieSelectors.isLoading,
  movieSelectors.movieIds,
  (isLoading, movieIds) => ({
    isLoading,
    movieIds,
  }),
);

const mapDispatchToProps = (dispatch: Dispatch<*>): DispatchProps => ({
  fetchMovies: () => dispatch(fetchMoviesAction()),
});

class MovieGrid extends PureComponent<Props, State> {
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
    const { movieIds, isLoading } = this.props;

    if (isLoading) {
      return <p>Loading &hellip;</p>;
    }

    return movieIds ? (
      <Grid>
        {movieIds.map(id => (
          <MovieCell key={id} id={id} />
        ))}
      </Grid>
    ) : (
      <p>No results</p>
    );
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(MovieGrid): ComponentType<*>);
