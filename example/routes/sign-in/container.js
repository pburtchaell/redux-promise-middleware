import React, { Component } from 'react';
import { connect } from 'react-redux';

class SignIn extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

    };
  }

  handleChange() {

  }

  render() {
    return (
      <div className="view-container">
        <label>Username
          <input
            type="text"
            placeholder="username"
            defaultValue="luke"
            onChange={() => null}
          />
        </label>
        <label>Password
          <input
            type="password"
            placeholder="password"
            defaultValue="skywalker"
            onChange={() => null}
          />
        </label>
        <button className="button">Sign in</button>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.account.session
  }),
  dispatch => ({
    signIn: (data) => session.create(data)
  })
)(SignIn);
