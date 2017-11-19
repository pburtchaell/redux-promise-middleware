/**
 * Function: request
 * Description: Make a request to the server and return a promise.
 */
async function request(url, options) {
  if (!url) {
    throw new Error('Preflight request error: URL parameter required');
  }

  if (!options) {
    throw new Error('Preflight request error: options parameter required');
  }

  // Fetch returns a promise
  return fetch(url, options)
    .then(response => {
      if (response.status > 200) {

        // Errors such as this are passed up to the middleware
        throw new Error(`Server error: ${response.status} status`);
      }

      return response.json();
    })
    .then(response => {
      if (response.errors) {
        throw new Error(`Server error: ${response.errors.message}`);
      }

      return response;
    });
}

export default request;
