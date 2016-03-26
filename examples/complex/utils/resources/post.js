const Post = require('../network').default('post');

export function getAllPosts() {
  return Post.get();
}
