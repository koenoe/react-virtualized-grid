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
    <div className={styles.item}>
      {movie.title}
      <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
    </div>
  );
}

export default MovieCell;
