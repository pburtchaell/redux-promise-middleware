/**
 * @private
 * @function request
 * @description Make a request to the server and return a promise.
 * @param {string} url
 * @param {object} options
 * @returns {promise}
 */
export default function request(url, options) {
  return new Promise((resolve, reject) => {
    if (!url) reject(new Error('No URL parameter'));
    if (!options) reject(new Error('No option parameter'));

    fetch(url, options)
      .then(response => response.json())
      .then(response => {
        if (response.errors) reject(response.errors);
        else resolve(response);
      })
      .catch(reject);
  });
}
