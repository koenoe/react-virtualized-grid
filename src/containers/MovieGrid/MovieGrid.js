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
import { range } from 'lodash';

import { fetchMovies as fetchMoviesAction } from 'state/movies/actions';
import * as movieSelectors from 'state/movies/selectors';
import MovieCell from 'containers/MovieCell';
import styles from 'components/Grid/Grid.css';

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

  cellMeasurerCache: *;
  mostRecentWidth: number;
  resizeAllFlag: boolean;
  list: *;
  registerList: (*) => void;
  calculateColumnCount: () => number;

  constructor(props: Props) {
    super(props);

    this.cellMeasurerCache = new CellMeasurerCache({
      defaultHeight: 175,
      defaultWidth: 100,
      fixedWidth: true,
    });
    this.mostRecentWidth = 0;
    this.resizeAllFlag = false;

    this.loadMore = this.loadMore.bind(this);
    this.calculateColumnCount = this.calculateColumnCount.bind(this);
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

  calculateColumnCount(): number {
    const width = this.mostRecentWidth;
    if (width > 1500 && width < 1700) {
      return 7;
    }
    if (width > 1300 && width < 1500) {
      return 6;
    }
    if (width > 1100 && width < 1300) {
      return 5;
    }
    if (width > 900 && width < 1100) {
      return 4;
    }
    if (width > 700 && width < 900) {
      return 3;
    }
    if (width > 500 && width < 700) {
      return 2;
    }
    if (width < 500) {
      return 1;
    }
    return 8;
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

    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreRows = isLoading ? () => {} : this.loadMore;

    // Every row is loaded except for our loading indicator row.
    const isCellLoaded = ({ index }) => !hasNextPage || index < movieIds.length;
    const isRowLoaded = ({ index }) =>
      !hasNextPage || index < Math.ceil(movieIds.length / this.calculateColumnCount());

    // Render a list item or a loading indicator.
    const rowRenderer = ({ index, key, style, parent }) => {
      const columnCount = this.calculateColumnCount();
      const fromIndex = index * columnCount;
      const toIndex = Math.min(fromIndex + columnCount, movieIds.length);
      const fromTo = range(fromIndex, toIndex);

      return (
        <CellMeasurer
          cache={this.cellMeasurerCache}
          key={key}
          parent={parent}
          rowIndex={index}
          width={this.mostRecentWidth}
        >
          {({ measure }) => (
            <div className={styles.grid} key={key} style={style}>
              {fromTo.map(
                i =>
                  isCellLoaded({ index: i }) ? (
                    <MovieCell onLoad={measure} key={movieIds[i]} id={movieIds[i]} />
                  ) : (
                    <div key={i}>Loading &hellip;</div>
                  ),
              )}
            </div>
          )}
        </CellMeasurer>
      );
    };

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
                  if (this.mostRecentWidth && this.mostRecentWidth !== width) {
                    this.resizeAllFlag = true;
                    setTimeout(this.resizeAll, 0);
                  }
                  this.mostRecentWidth = width;
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
                      rowCount={Math.ceil(movieIds.length / this.calculateColumnCount())}
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
