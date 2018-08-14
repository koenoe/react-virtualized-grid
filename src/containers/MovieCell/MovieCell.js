// @flow
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as movieSelectors from 'state/movies/selectors';

import MovieCell from 'components/MovieCell';

import type { ComponentType } from 'react';
import type { OutputSelector } from 'reselect';

type OwnProps = {|
  id: number,
|};

type OutProps = {|
  movie: Object,
|};

type State = {||};

export const mapStateToProps: OutputSelector<State, OwnProps, OutProps> = createStructuredSelector({
  movie: (state, ownProps: OwnProps) => movieSelectors.movie(state, ownProps.id),
});

export default (connect(
  mapStateToProps,
  null,
)(MovieCell): ComponentType<*>);
