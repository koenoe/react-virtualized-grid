// @flow
import { connect } from 'react-redux';
// import { createStructuredSelector, createSelector } from 'reselect';
import { createSelector } from 'reselect';

import * as movieSelectors from 'state/movies/selectors';

import MovieCell from 'components/MovieCell';

import type { ComponentType } from 'react';
import type { OutputSelector } from 'reselect';

type OwnProps = {|
  id: number,
  onLoad?: void,
|};

type OutProps = {|
  movie: Object,
  onLoad: void,
|};

type State = {||};

export const mapStateToProps: OutputSelector<State, OwnProps, OutProps> = createSelector(
  [
    (state, ownProps: OwnProps) => movieSelectors.movie(state, ownProps.id),
    (state, ownProps) => ownProps,
  ],
  (movie, ownProps) => ({
    movie,
    onLoad: ownProps.onLoad,
  }),
);

// export const mapStateToProps: OutputSelector<State, OwnProps, OutProps> = createStructuredSelector({
//   movie: (state, ownProps: OwnProps) => movieSelectors.movie(state, ownProps.id),
// });

export default (connect(
  mapStateToProps,
  null,
)(MovieCell): ComponentType<*>);
