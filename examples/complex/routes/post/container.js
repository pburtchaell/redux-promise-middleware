import React, { Component } from 'react';
import { connect } from 'react-redux';

class Post extends Component {
  render() {
    return (
      <div className="view-container">

      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.post
  }),
  dispatch => ({
    getPost: id => post.get(id)
  })
)(Post);
