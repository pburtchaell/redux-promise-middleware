import store from './store';
import 'isomorphic-fetch';

// Request a post from the API with a 1s delay
const getPost = id => ({
  type: 'GET_POST',
  payload: new Promise(resolve => {
    setTimeout(() => fetch(`/api/posts/${id}`).then(response => {
      resolve(response.json());
    }), 1000);
  })
})

const initialize = () => {
  const mount = document.querySelector('#mount');

  // Load the post when button is clicked
  const button = document.querySelector('#load');
  button.addEventListener('click', e => store.dispatch(getPost(1)));

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
