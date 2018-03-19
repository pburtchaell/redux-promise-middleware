/* eslint-disable arrow-body-style, no-param-reassign */
import store from './store';

const get = (id) => ({
  type: 'GET',
  payload: new Promise((resolve) => {
    // "Simulate" a network by adding a delay to each promise
    setTimeout(() => resolve(id), 1000 * id);
  }),
});

const getAll = () => {
  return (dispatch) => {
    return dispatch({
      type: 'GET_ALL',
      payload: Promise.all([
        dispatch(get(1)),
        dispatch(get(2)),
        dispatch(get(3)),
      ]),
    });
  };
};

const render = (mount, state) => {
  if (state.isPending) {
    mount.innerHTML = 'Loading...';
  } else {
    mount.innerHTML = 'Done.';
  }
};

const initialize = () => {
  const mount = document.querySelector('#mount');

  // Load the post when button is clicked
  const button = document.querySelector('#load');
  button.addEventListener('click', () => store.dispatch(getAll()));

  render(mount, {});
  store.subscribe(() => render(mount, store.getState()));
};

initialize();
