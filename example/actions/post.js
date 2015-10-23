import * as types from '../constants/post';
import * as utils from '../utils/server/resources/post';

export function getAllPosts() {
  return {
    type: types.GET_POSTS,
    payload: {
      promise: utils.getAllPosts(),
      onSuccess: () => null,
      onError: () => null
    }
  };
}
