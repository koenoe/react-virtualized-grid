// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchMovies as fetchMoviesAction } from 'state/movies/actions';
import * as movieSelectors from 'state/movies/selectors';
import MovieCell from 'containers/MovieCell';
import Grid from 'components/Grid';

import type { ComponentType } from 'react';

type OwnProps = {||};

type OutProps = {|
  movieIds: Array<number>,
  isLoading: boolean,
  currentPage: number,
  totalNumberOfPages: number,
  totalNumberOfItems: number,
|};

type DispatchProps = {|
  fetchMovies: (page?: number) => void,
|};

type Props = {| ...OwnProps, ...OutProps, ...DispatchProps |};

type State = {||};

export const mapStateToProps: State => OutProps = createStructuredSelector({
  isLoading: movieSelectors.isLoading,
  currentPage: movieSelectors.currentPage,
  totalNumberOfPages: movieSelectors.totalNumberOfPages,
  totalNumberOfItems: movieSelectors.totalNumberOfItems,
  movieIds: movieSelectors.movieIds,
});

const mapDispatchToProps = (dispatch: Dispatch<*>): DispatchProps => ({
  fetchMovies: (page?: number) => dispatch(fetchMoviesAction(page)),
});

class MovieGrid extends PureComponent<Props, State> {
  state: State;

  loadMore: () => void;

  constructor(props: Props) {
    super(props);

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const { fetchMovies } = this.props;
    fetchMovies();
  }

  loadMore() {
    const { currentPage, fetchMovies } = this.props;
    return fetchMovies(currentPage + 1);
  }

  render() {
    const { isLoading, currentPage, totalNumberOfPages, totalNumberOfItems, movieIds } = this.props;
    const hasNextPage = currentPage < totalNumberOfPages;
    return (
      <Grid
        aspectRatio={1.5}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        loadMore={this.loadMore}
        totalNumberOfItems={totalNumberOfItems}
        numberOfItems={movieIds.length}
      >
        {({ isCellLoaded, index, style, isScrolling }) => (
          <div key={movieIds[index] || index} style={style}>
            {isCellLoaded && <MovieCell placeholder={isScrolling} id={movieIds[index]} />}
          </div>
        )}
      </Grid>
    );
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(MovieGrid): ComponentType<*>);
