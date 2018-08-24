/* eslint-disable import/prefer-default-export */
import { createAsyncAction } from 'redux-promise-middleware-actions';

/*
 * Function: getDog
 * Description: Fetch an image of a dog from the [Dog API](https://dog.ceo/dog-api/)
 */
export const getDog = createAsyncAction('GET_DOG', () => (
  fetch('https://dog.ceo/api/breeds/image/random')
    .then((response) => response.json())
));
