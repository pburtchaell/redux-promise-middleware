/* eslint-disable no-param-reassign */
import store from './store';
import { getDog } from './actions';

/*
 * Function: render
 * Description: Renders the given state to the given HTML DOM node
 */
const render = (mount, state) => {
  if (state.pending) {
    mount.innerHTML = 'Loading...';
  } else if (state.data) {
    mount.innerHTML = `<img src=${state.data.message} />`;
  }
};

/*
 * Function: initializes
 * Description: Renders the initial state of the example
 */
const initialize = () => {
  const mount = document.querySelector('#mount');

  // Load the post when button is clicked
  const button = document.querySelector('#load');
  button.addEventListener('click', () => store.dispatch(getDog()));

  render(mount, {});
  store.subscribe(() => render(mount, store.getState()));
};

initialize();
