import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    return (
      <div className="view-container">
        <Link to="/sign-in" className="button">Sign in</Link>
      </div>
    );
  }
}

export default Home;
