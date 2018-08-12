// @flow
import produce from 'immer';
import {
  FETCH_MOVIES_REQUEST,
  FETCH_MOVIES_FAILURE,
  FETCH_MOVIES_SUCCESS,
} from 'state/movies/actions';

import type { MoviesAction } from 'state/movies/actions';

export type State = {|
  error: any,
  isLoading: boolean,
  items: Array<Object>,
  currentPage: number,
  totalNumberOfItems?: number,
  totalNumberOfPages?: number,
|};

const initialState: State = {
  isLoading: false,
  error: null,
  items: [],
  currentPage: 0,
  totalNumberOfItems: 0,
  totalNumberOfPages: 0,
};

const reducer = produce((draft: State, action: MoviesAction) => {
  switch (action.type) {
    case FETCH_MOVIES_REQUEST:
      draft.isLoading = true;
      break;
    case FETCH_MOVIES_SUCCESS:
      draft.isLoading = false;
      draft.items = draft.items.concat(action.items);
      draft.currentPage = action.currentPage;
      draft.totalNumberOfItems = action.totalNumberOfItems;
      draft.totalNumberOfPages = action.totalNumberOfPages;
      break;
    case FETCH_MOVIES_FAILURE:
      draft.isLoading = false;
      draft.error = action.error;
      break;
    default:
      return draft;
  }
  return draft;
}, initialState);

export default reducer;
