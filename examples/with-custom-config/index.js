/* eslint-disable no-param-reassign */
import store from './store';

/*
 * Function: getDog
 * Description: Fetch an image of a dog from the [Dog API](https://dog.ceo/dog-api/)
 */
const getDogImage = () => ({
  type: 'GET-DOG',
  payload: fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json()),
});

/*
 * Function: render
 * Description: Renders the given state to the given HTML DOM node
 */
const render = (mount, state) => {
  if (state.isPending) {
    mount.innerHTML = 'Loading...';
  } else if (state.image) {
    mount.innerHTML = `<img src=${state.image} />`;
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
  button.addEventListener('click', () => store.dispatch(getDogImage()));

  render(mount, {});
  store.subscribe(() => render(mount, store.getState()));
};

initialize();
