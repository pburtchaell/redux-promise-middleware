export default function buildURL(resource, id) {
  const base = '/api/v1';

  return id ? `${base}/${resource}/${id}` : `${base}/${resource}`;
};
