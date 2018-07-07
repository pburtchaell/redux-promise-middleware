/* eslint-disable no-param-reassign */
import * as actions from './actions';
import store from './store';

const render = (mount, state) => {
  if (state.images) {
    mount.innerHTML = state.images.reduce((html, image) => `${html} <img src=${image} />`, '');
  }
};

const initialize = () => {
  const mount = document.querySelector('#mount');

  // Load the post when button is clicked
  const button = document.querySelector('#load');
  button.addEventListener('click', () => {
    store.dispatch(actions.getAnimals([
      actions.getFirstDog,
      actions.getAnotherDog,
      actions.getFinalDog,
    ]));
  });

  render(mount, {});
  store.subscribe(() => render(mount, store.getState()));
};

initialize();
