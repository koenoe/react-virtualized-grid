// @flow
import React from 'react';

import styles from './MovieCell.css';

import type { Node } from 'react';

type Props = {|
  movie: Object,
|};

function MovieCell(props: Props): Node {
  const { movie } = props;
  return <div className={styles.item}>{movie.title}</div>;
}

export default MovieCell;
