// @flow
import React from 'react';
// import Img from 'react-image';

import styles from './MovieCell.css';

import type { Node } from 'react';

type Props = {|
  movie: Object,
  onLoad: void,
|};

function MovieCell(props: Props): Node {
  const { movie, onLoad } = props;
  return (
    <div className={styles.item}>
      <img
        onLoad={onLoad}
        className={styles.image}
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{movie.title}</div>
      </div>
    </div>
  );
}

export default MovieCell;
