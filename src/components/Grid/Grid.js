// @flow
import React from 'react';

import styles from './Grid.css';

import type { Node } from 'react';

type Props = {|
  children: any,
|};

function Grid(props: Props): Node {
  return <div className={styles.grid}>{props.children}</div>;
}

export default Grid;
