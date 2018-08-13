// @flow
import React from 'react';

import styles from './MovieCell.css';

import type { Node } from 'react';

type Props = {|
  movie: Object,
  onLoad: void,
|};

function MovieCell(props: Props): Node {
  const { movie, onLoad } = props;
  const src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : 'http://placekitten.com/500/750';
  return (
    <div className={styles.item}>
      <img onLoad={onLoad} className={styles.image} src={src} alt={`${movie.title} poster`} />
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{movie.title}</div>
      </div>
    </div>
  );
}

export default MovieCell;
