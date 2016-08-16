import { connect } from 'react-redux';
import * as errorActions from '../../actions/error';

export default connect(
  state => ({}),
  dispatch => ({
    throwGlobalError: message => {
      dispatch(errorActions.rejectPromiseWithGlobalError(message))
    },
    throwLocalError: message => {
      dispatch(errorActions.rejectPromiseWithLocalError(message))
    },
    getPost: id => console.log(id)
  })
)(require('./component').default);
