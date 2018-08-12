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
  +currentPage?: number,
  +totalNumberOfItems?: number,
  +totalNumberOfPages?: number,
|};

const initialState: State = {
  isLoading: false,
  error: null,
  items: [],
  currentPage: 0,
  totalNumberOfItems: 0,
  totalNumberOfPages: 0,
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
        currentPage: action.currentPage,
        totalNumberOfItems: action.totalNumberOfItems,
        totalNumberOfPages: action.totalNumberOfPages,
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
