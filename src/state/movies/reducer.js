// @flow
import {
  FETCH_MOVIES_REQUEST,
  FETCH_MOVIES_FAILURE,
  FETCH_MOVIES_SUCCESS,
} from 'state/movies/actions';

import type { MoviesAction } from 'state/movies/actions';

export type State = {|
  +error?: any,
  +isLoading: boolean,
  +items?: Array<Object>,
|};

const initialState: State = {
  isLoading: false,
};

export default function (
  state: State = initialState,
  action: MoviesAction,
): State {
  switch (action.type) {
    case FETCH_MOVIES_REQUEST:
      return {
        isLoading: true,
      };
    case FETCH_MOVIES_SUCCESS:
      return {
        isLoading: false,
        items: action.items,
      };
    case FETCH_MOVIES_FAILURE:
      return {
        isLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
}
