export default function buildURL({ id, resource } = {}) {
  let parameters = [
    'http://localhost:8000',
    'api',
    'v1'
  ];

  if (resource) parameters.concat([resource]);
  if (id) parameters.concat([id]);

  console.log(parameters.join('/'));

  return parameters.join('/');
};
