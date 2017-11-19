import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { application } from '../actions';

class App extends Component {
  componentDidMount() {
    if (!this.props.isInitialized) this.props.initialize();
  }

  render() {
    const { isSupported, isInitialized } = this.props;

    /**
     * Do not mount the application until it has been initialized. Once
     * it has been initialized, show the full application if it is supported.
     * If it is not supported (due to network error or lack of browser support),
     * then show the warning.
     */
    if (isInitialized) {
      return (
        <div className="body-wrapper">
          <div className="row">
            <div className="small-12 large-6 large-offset-3 end columns">
              <h4>Redux Promise Middleware Example</h4>
            </div>
            <div className="small-12 large-6 large-offset-3 end columns">
              {this.props.children}
            </div>
          </div>
        </div>
      );
    }

    // Show nothing while initializing
    return (
      <div>Application loading...</div>
    );
  }
}

App.propTypes = {
  initialize: PropTypes.func.isRequired,
  isInitialized: PropTypes.bool.isRequired
};

export default connect(
  state => (state.application.support),
  dispatch => ({
    initialize: () => dispatch(application.initialize())
  })
)(App);
