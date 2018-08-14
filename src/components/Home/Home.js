// @flow
import React, { Fragment } from 'react';

import styles from './Home.css';
import MovieGrid from 'containers/MovieGrid';

import type { Node } from 'react';

function Home(): Node {
  return (
    <Fragment>
      <h1 className={styles.h1}>Popular movies</h1>
      <MovieGrid />
    </Fragment>
  );
}

export default Home;
