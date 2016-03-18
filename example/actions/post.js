import * as types from '../constants/post';
import * as utils from '../utils/resources/post';

export function getAllPosts() {
  return dispatch => {

    return dispatch({
      type: types.GET_POSTS,
      payload: {
        promise: utils.getAllPosts()
      }
    });
  };
}
