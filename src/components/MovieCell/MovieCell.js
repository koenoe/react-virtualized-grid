// @flow
import React from 'react';

import styles from './MovieCell.css';

import type { Node } from 'react';

type Props = {|
  movie: Object,
|};

function MovieCell(props: Props): Node {
  const { movie } = props;
  return (
    <div>
      <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{movie.title}</div>
      </div>
    </div>
  );
}

export default MovieCell;
