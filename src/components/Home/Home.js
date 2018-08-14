// @flow
import type { Node } from 'react';

import React, { Fragment } from 'react';

import MovieGrid from 'containers/MovieGrid';
import styles from './Home.css';

function Home(): Node {
  return (
    <Fragment>
      <h1 className={styles.h1}>Popular movies</h1>
      <MovieGrid />
    </Fragment>
  );
}

export default Home;
