// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Grid from 'components/Grid';

import type { ComponentType } from 'react';

type OwnProps = {|
|};

type DispatchProps = {|
|};

type Props = {| ...OwnProps, ...DispatchProps |};

type State = {|
|}

class Home extends PureComponent<Props, State> {
  state: State;
  foo: string;

  constructor(props: Props) {
    super(props);

    this.foo = 'bar';
  }

  render() {
    return (
      <Grid />
    );
  }
}

// const mapStateToProps = {};

const mapDispatchToProps = {};

export default (
  connect(null, mapDispatchToProps)(Home): ComponentType<*>
);
