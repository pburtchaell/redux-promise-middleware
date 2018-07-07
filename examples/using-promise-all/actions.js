/*
 * Function: getDog
 * Description: Fetch an image of a dog from the [Dog API](https://dog.ceo/dog-api/)
 */
export const getFirstDog = () => ({
  type: 'GET_FIRST_DOG',
  payload: fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json())
    .then(json => ({ image: json.message, ...json })),
});

/*
 * Function: getAnotherDog
 * Description: Fetch another dog
 */
export const getAnotherDog = () => ({
  type: 'GET_ANOTHER_DOG',
  payload: fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json())
    .then(json => ({ image: json.message, ...json })),
});

/*
 * Function: getFinalDog
 * Description: Fetch a final dog
 */
export const getFinalDog = () => ({
  type: 'GET_FINAL_DOG',
  payload: fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json())
    .then(json => ({ image: json.message, ...json })),
});

/*
 * Function: getAnimals
 * Description: Fetch all the animal images
 */
export const getAnimals = (actions) => dispatch => dispatch({
  type: 'GET_ANIMALS',

  /*
   * Promise.all accepts an array of promises. Here, we remap the given array of actions
  * to an array of promises by dispatching each action.
   */
  payload: Promise.all(actions.map((action) => dispatch(action()))),
});
