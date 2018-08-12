// @flow
import React, { Fragment } from 'react';

// import styles from './Home.css';
import MovieGrid from 'containers/MovieGrid';

import type { Node } from 'react';

function Home(): Node {
  return (
    <Fragment>
      <h1>Welcome to the homepage</h1>
      <MovieGrid />
    </Fragment>
  );
}

export default Home;
