// @flow
import React, { PureComponent } from 'react';
import { range } from 'lodash';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller,
} from 'react-virtualized';

import styles from './Grid.css';

import type { Node } from 'react';

type ChildrenFn = ({
  index: number,
  measure: void,
  isCellLoaded: boolean,
}) => Node;

type Props = {|
  children: ChildrenFn,
  hasNextPage: boolean,
  isLoading: boolean,
  numberOfItems: number,
  loadMore: Function,
  totalNumberOfItems: number,
|};

type State = {||};
class Grid extends PureComponent<Props, State> {
  calculateColumnCount: () => number;
  cellMeasurerCache: *;
  list: *;
  mostRecentWidth: number;
  registerList: (*) => void;
  resizeAllFlag: boolean;
  state: State;

  constructor(props: Props) {
    super(props);

    this.cellMeasurerCache = new CellMeasurerCache({
      fixedWidth: true,
    });
    this.mostRecentWidth = 0;
    this.resizeAllFlag = false;

    this.calculateColumnCount = this.calculateColumnCount.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.resizeAllFlag) {
      this.resizeAllFlag = false;
      this.cellMeasurerCache.clearAll();
      if (this.list) {
        this.list.recomputeRowHeights();
      }
    } else if (this.props.numberOfItems !== prevProps.numberOfItems) {
      const index = prevProps.numberOfItems;
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

  resizeAll = () => {
    this.resizeAllFlag = false;
    this.cellMeasurerCache.clearAll();
    if (this.list) {
      this.list.recomputeRowHeights();
    }
  };

  setListRef = (ref: *) => {
    this.list = ref;
    this.registerList(ref);
  };

  render() {
    const {
      children,
      hasNextPage,
      isLoading,
      loadMore,
      numberOfItems,
      totalNumberOfItems,
    } = this.props;
    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreRows = isLoading ? () => {} : loadMore;
    // Every row is loaded except for our loading indicator row.
    const isRowLoaded = ({ index }) =>
      !hasNextPage || index < Math.ceil(numberOfItems / this.calculateColumnCount());
    const isCellLoaded = ({ index }) => !hasNextPage || index < numberOfItems;
    // Render a list item or a loading indicator.
    const rowRenderer = ({ index, key, style, parent }) => {
      const columnCount = this.calculateColumnCount();
      const fromIndex = index * columnCount;
      const toIndex = Math.min(fromIndex + columnCount, numberOfItems);
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
              {fromTo.map(i =>
                children({ index: i, measure, isCellLoaded: isCellLoaded({ index }) }),
              )}
            </div>
          )}
        </CellMeasurer>
      );
    };

    return numberOfItems ? (
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
                      rowCount={Math.ceil(numberOfItems / this.calculateColumnCount())}
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
    ) : null;
  }
}

export default Grid;
