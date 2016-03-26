import Network from '../network';
import { storeToken } from '../token';

const Session = () => {
  const network = Network();

  return {
    create: data => new Promise((resolve, reject) => {
      const request = network.post({
        path: TOKEN_PATH
      }, { ...data }, {
        authorization: false
      });

      // Store the token, then update the original promise
      request
        .then(response => storeToken(response.token))
        .then(resolve, reject);
    })
  };
};

export default Session;
