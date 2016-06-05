import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AppWarning from './appWarning';
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
      return isSupported ? (
        <div className="body-wrapper">
          <div className="row">
            <div className="small-12 large-6 large-offset-3 end columns">
              <h1>Redux Promise Middleware Example</h1>
            </div>
            <div className="small-12 large-6 large-offset-3 end columns">
              {this.props.children}
            </div>
          </div>
        </div>
      ) : <AppWarning />;
    }

    // Show nothing while initializing
    return (
      <div>application loading...</div>
    );
  }
}

App.propTypes = {
  initialize: PropTypes.func.isRequired,
  isSupported: PropTypes.bool.isRequired,
  isInitialized: PropTypes.bool.isRequired
}

export default connect(
  state => ({
    ...state.application.support
  }),
  dispatch => ({
    initialize: () => dispatch(application.initialize())
  })
)(App);
