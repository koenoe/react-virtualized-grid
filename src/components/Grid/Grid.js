// @flow
import React, { PureComponent } from 'react';
import { range } from 'lodash';
import { AutoSizer, InfiniteLoader, List, WindowScroller } from 'react-virtualized';

import styles from './Grid.css';

import type { Node } from 'react';

type ChildrenFn = ({
  index: number,
  isCellLoaded: boolean,
  style: Object,
  isScrolling: boolean,
}) => Node;

type Props = {|
  children: ChildrenFn,
  hasNextPage: boolean,
  isLoading: boolean,
  numberOfItems: number,
  loadMore: Function,
  totalNumberOfItems: number,
  aspectRatio: number,
  gutterSize: number,
|};

const calculateColumnCount = (width: number): number => {
  if (width >= 1300 && width <= 1500) {
    return 6;
  }
  if (width >= 1100 && width <= 1300) {
    return 5;
  }
  if (width >= 900 && width <= 1100) {
    return 4;
  }
  if (width >= 700 && width <= 900) {
    return 3;
  }
  if (width >= 400 && width <= 700) {
    return 2;
  }
  if (width <= 400) {
    return 1;
  }
  return 8;
};

class Grid extends PureComponent<Props> {
  static defaultProps: $Shape<Props>;

  render() {
    const {
      aspectRatio,
      children,
      gutterSize,
      hasNextPage,
      isLoading,
      loadMore,
      numberOfItems,
      totalNumberOfItems,
    } = this.props;
    return (
      numberOfItems > 0 && (
        <section style={{ padding: `0 ${gutterSize}px` }}>
          <AutoSizer disableHeight>
            {({ width }) => {
              const columnCount = calculateColumnCount(width);
              const rowCount = Math.ceil(numberOfItems / columnCount);
              const halfGutterSize = gutterSize / 2;
              return (
                <InfiniteLoader
                  isRowLoaded={({ index }) => !hasNextPage || index < rowCount}
                  loadMoreRows={isLoading ? () => {} : loadMore}
                  rowCount={Math.ceil(totalNumberOfItems / columnCount)}
                  minimumBatchSize={5}
                >
                  {({ onRowsRendered, registerChild }) => (
                    <WindowScroller scrollElement={window}>
                      {({ height, isScrolling, onChildScroll, scrollTop }) => (
                        <List
                          ref={registerChild}
                          autoHeight
                          height={height}
                          isScrolling={isScrolling}
                          onRowsRendered={onRowsRendered}
                          onScroll={onChildScroll}
                          rowCount={rowCount}
                          rowHeight={(width / columnCount) * aspectRatio + gutterSize}
                          rowRenderer={({ index, key, style }) => {
                            const fromIndex = index * columnCount;
                            const toIndex = Math.min(fromIndex + columnCount, numberOfItems);
                            return (
                              <div key={key} className={styles.grid} style={style}>
                                {range(fromIndex, toIndex).map(i =>
                                  children({
                                    isScrolling,
                                    index: i,
                                    isCellLoaded: !hasNextPage || i < numberOfItems,
                                    style: {
                                      width: width / columnCount - gutterSize,
                                      height: '100%',
                                      margin: `0 ${halfGutterSize}px`,
                                    },
                                  }),
                                )}
                              </div>
                            );
                          }}
                          scrollTop={scrollTop}
                          width={width}
                          overscanRowCount={1}
                        />
                      )}
                    </WindowScroller>
                  )}
                </InfiniteLoader>
              );
            }}
          </AutoSizer>
        </section>
      )
    );
  }
}

Grid.defaultProps = {
  aspectRatio: 1,
  gutterSize: 20,
};

export default Grid;
