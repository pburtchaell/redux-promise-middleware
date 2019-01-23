import { AsyncAction } from 'redux-promise-middleware';
import store, { State } from './store';

/**
 * @private
 * Fetch an image of a dog from the [Dog API](https://dog.ceo/dog-api/)
 */
const getDog = (): AsyncAction => ({
  type: 'GET_DOG',
  payload: fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json()),
});

/**
 * @private
 * Renders the given state to the given HTML DOM node
 */
const render = (mount: HTMLElement | null, state: State) => {
  if (mount && state.isPending) {
    mount.innerHTML = 'Loading...';
  } else if (mount && state.image) {
    mount.innerHTML = `<img src=${state.image} />`;
  }
};

/**
 * @private
 * Renders the initial state of the example
 */
const initialize = () => {
  const mount: HTMLElement | null = document.querySelector('#mount');

  // Load the post when button is clicked
  const button: HTMLElement | null = document.querySelector('#load');
  if (button) button.addEventListener('click', () => store.dispatch(getDog()));

  render(mount, store.getState());
  store.subscribe(() => render(mount, store.getState()));
};

initialize();
