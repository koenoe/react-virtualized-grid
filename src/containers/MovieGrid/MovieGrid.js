// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  AutoSizer,
  List,
  InfiniteLoader,
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';

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

  cellMeasurerCache: *;
  cellMostRecentWidth: number;
  resizeAllFlag: boolean;
  list: *;
  registerList: (*) => void;

  constructor(props: Props) {
    super(props);

    this.cellMeasurerCache = new CellMeasurerCache({
      defaultHeight: 175,
      defaultWidth: 100,
      // fixedWidth: true,
    });
    this.cellMostRecentWidth = 0;
    this.resizeAllFlag = false;

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.fetchMovies();
  }

  componentDidUpdate(prevProps) {
    if (this.resizeAllFlag) {
      this.resizeAllFlag = false;
      this.cellMeasurerCache.clearAll();
      if (this.list) {
        this.list.recomputeRowHeights();
      }
    } else if (this.props.movieIds !== prevProps.movieIds) {
      const index = prevProps.movieIds.length;
      this.cellMeasurerCache.clear(index, 0);
      if (this.list) {
        this.list.recomputeRowHeights(index);
      }
    }
  }

  loadMore() {
    const { currentPage } = this.props;
    return this.props.fetchMovies(currentPage + 1);
  }

  resizeAll = () => {
    this.resizeAllFlag = false;
    this.cellMeasurerCache.clearAll();
    if (this.list) {
      this.list.recomputeRowHeights();
    }
  };

  setListRef = ref => {
    this.list = ref;
    this.registerList(ref);
  };

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
    const rowRenderer = ({ index, key, style, parent }) => (
      <CellMeasurer
        cache={this.cellMeasurerCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
        width={this.cellMostRecentWidth}
      >
        {({ measure }) => (
          <div key={key} style={style}>
            {isRowLoaded({ index }) ? (
              <MovieCell onLoad={measure} id={movieIds[index]} />
            ) : (
              'Loading &hellip;'
            )}
          </div>
        )}
      </CellMeasurer>
    );

    return movieIds ? (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        minimumBatchSize={20}
        rowCount={totalNumberOfItems}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller scrollElement={window}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => {
                  if (this.cellMostRecentWidth && this.cellMostRecentWidth !== width) {
                    this.resizeAllFlag = true;
                    setTimeout(this.resizeAll, 0);
                  }
                  this.cellMostRecentWidth = width;
                  this.registerList = registerChild;

                  return (
                    <List
                      autoHeight
                      deferredMeasurementCache={this.cellMeasurerCache}
                      height={height}
                      isScrolling={isScrolling}
                      onRowsRendered={onRowsRendered}
                      onScroll={onChildScroll}
                      ref={this.setListRef}
                      rowCount={rowCount}
                      rowHeight={this.cellMeasurerCache.rowHeight}
                      rowRenderer={rowRenderer}
                      scrollTop={scrollTop}
                      width={width}
                    />
                  );
                }}
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
