import 'isomorphic-fetch';
import store from './store';

// Request a post from the API with a 1s delay
const getPost = id => ({
  type: 'GET_POST',
  payload: new Promise(resolve => {
    setTimeout(() => fetch(`/api/posts/${id}`).then(response => {
      resolve(response.json());
    }), 1000);
  })
});

const initialize = () => {
  const mount = document.querySelector('#mount');

  // Load the post when button is clicked
  const button = document.querySelector('#load');
  button.addEventListener('click', () => store.dispatch(getPost(1)));

  const render = (state = {}) => {
    if (state.isPending) {
      mount.innerHTML = 'Loading post...';
    } else if (state.body) {
      mount.innerHTML = state.body;
    }
  };

  render();
  store.subscribe(() => render(store.getState()));
};

initialize();
