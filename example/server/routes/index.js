export function handleGet(req, res) {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
}
