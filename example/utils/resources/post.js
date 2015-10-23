const Post = require('../server')('post');

export function getAllPosts() {
  return Post.get();
}
