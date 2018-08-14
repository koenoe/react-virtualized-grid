// @flow
import React from 'react';

import styles from './Placeholder.css';

import type { Node } from 'react';

function Placeholder(): Node {
  return (
    <div className={styles.placeholder}>
      <div className={styles.spinner}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default Placeholder;
