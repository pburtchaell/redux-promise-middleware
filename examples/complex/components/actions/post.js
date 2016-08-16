import * as types from '../constants/post';
import network from '../utils/network';

export const getAllPosts = () => ({
  type: types.GET_POSTS,
  payload: network.get({
    resource: 'posts'
  })
});

export const getPost = id => ({
  type: types.GET_POST,
  payload: network.get({
    resource: 'posts',
    id
  })
});

export const createPost = post => ({
  type: types.CREATE_POST,
  payload: {
    promise: network.post({
      delay: 1000,
      resource: 'posts',
      body: post
    }),
    data: post
  }
});
