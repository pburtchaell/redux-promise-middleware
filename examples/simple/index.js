import 'isomorphic-fetch';
import store from './store';

const TYPE = 'GET_POST';

// Request a post from the API with a 1s delay
const getPost = id => ({
  type: TYPE,
  payload: new Promise(resolve => {
    setTimeout(() => fetch(`/api/posts/${id}`).then(response => {
      resolve(response.json());
    }), 1000);
  })
});

const getRejectedPost = () => ({
  type: TYPE,
  payload: new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Could not fetch the post'));
    }, 1000);
  })
});

const initialize = () => {
  const mount = document.querySelector('#mount');

  // Load the post when button is clicked
  const buttonForFulfilled = document.querySelector('#load_fulfilled');
  buttonForFulfilled.addEventListener('click', () => {
    store.dispatch(getPost(1));
  });

  const buttonForRejected = document.querySelector('#load_rejected');
  buttonForRejected.addEventListener('click', () => {
    store.dispatch(getRejectedPost(false));
  });

  const render = (state = {}) => {
    if (state.isPending) {

      // The post was requested. We should let the user know it's loading.
      mount.innerHTML = 'Loading post...';
    } else if (state.message) {
      // throw new Error('Is this swallowed?')

      // The request was fulfilled. Let's show the resulting message!
      mount.innerHTML = state.message;
    } else if (state.error) {

      // Oh no! The request was rejected. Let's show the reason for the error.
      mount.innerHTML = state.reason;
    }
  };

  render();
  store.subscribe(() => render(store.getState()));
};

initialize();
