// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AutoSizer, List, InfiniteLoader, WindowScroller } from 'react-virtualized';

import { fetchMovies as fetchMoviesAction } from 'state/movies/actions';
import * as movieSelectors from 'state/movies/selectors';
import MovieCell from 'containers/MovieCell';

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
  loadMore: (*) => void;

  constructor(props: Props) {
    super(props);

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.fetchMovies();
  }

  loadMore() {
    const { currentPage } = this.props;
    return this.props.fetchMovies(currentPage + 1);
  }

  render() {
    const { currentPage, movieIds, isLoading, totalNumberOfPages, totalNumberOfItems } = this.props;

    const hasNextPage = currentPage < totalNumberOfPages;

    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const rowCount = hasNextPage ? movieIds.length + 1 : movieIds.length;

    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreRows = isLoading ? () => {} : this.loadMore;

    // Every row is loaded except for our loading indicator row.
    const isRowLoaded = ({ index }) => !hasNextPage || index < movieIds.length;

    // Render a list item or a loading indicator.
    const rowRenderer = ({ index, key, style }) => {
      let content;

      if (!isRowLoaded({ index })) {
        content = 'Loading &hellip;';
      } else {
        content = <MovieCell id={movieIds[index]} />;
      }

      return (
        <div key={key} style={style}>
          {content}
        </div>
      );
    };

    return movieIds ? (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={totalNumberOfItems}
        minimumBatchSize={20}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller scrollElement={window}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    ref={registerChild}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={rowRenderer}
                    height={height}
                    width={width}
                    rowHeight={250}
                    rowCount={rowCount}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    autoHeight
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    ) : (
      <p>No results</p>
    );
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(MovieGrid): ComponentType<*>);
