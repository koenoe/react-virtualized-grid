// @flow
import type { Node } from 'react';

import React from 'react';
import Img from 'react-image';

import Placeholder from 'components/Placeholder';
import styles from './MovieCell.css';

type Props = {|
  movie: Object,
  placeholder: boolean,
|};

function MovieCell(props: Props): Node {
  const { movie, placeholder } = props;
  const src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : 'http://placekitten.com/500/750';
  return (
    <div className={styles.item}>
      <div className={styles.imageWrapper}>
        {placeholder ? (
          <Placeholder />
        ) : (
          <Img
            className={styles.image}
            src={src}
            alt={`${movie.title} poster`}
            loader={<Placeholder />}
          />
        )}
      </div>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{movie.title}</div>
      </div>
    </div>
  );
}

export default MovieCell;
