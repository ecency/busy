import * as authActions from '../auth/authActions';
import * as bookmarksActions from './bookmarksActions';
import { USER_METADATA_KEY } from '../helpers/constants';

const initialState = {
  list: {},
  pendingBookmarks: [],
};

const bookmarks = (state = initialState, action) => {
  switch (action.type) {
    case authActions.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      return {
        ...state,
        list: action.payload.user_metadata.bookmarks || initialState.list,
      };
    case bookmarksActions.TOGGLE_BOOKMARK_START:
      return {
        ...state,
        pendingBookmarks: [...state.pendingBookmarks, action.meta.id],
      };
    case bookmarksActions.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        list: action.payload || initialState.list,
        pendingBookmarks: state.pendingBookmarks.filter(bookmark => bookmark !== action.meta.id),
      };
    case bookmarksActions.TOGGLE_BOOKMARK_ERROR:
      return {
        ...state,
        pendingBookmarks: state.pendingBookmarks.filter(bookmark => bookmark !== action.meta.id),
      };
    default:
      try {
        return {
          ...state,
          list: JSON.parse(localStorage.getItem(USER_METADATA_KEY)).bookmarks || state.list,
        };
      } catch (error) {
        // this is due to localStorage hasn't been ready. Can be ignored.
        return state;
      }
  }
};

export default bookmarks;

export const getBookmarks = state => state.list;
export const getPendingBookmarks = state => state.pendingBookmarks;
