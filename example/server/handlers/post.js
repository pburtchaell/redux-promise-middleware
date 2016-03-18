export function handlePost(req, res) {
  res.json({
    data: [
      {
        type: 'posts',
        id: '1LOL234',
        attributes: {
          title: res.param.title,
          author: res.param.author,
          body: res.param.body
        }
      }
    ]
  });
}

export function handleGet(req, res) {
  var id = req.param.id;

  res.json({
    data: [
      {
        type: 'posts',
        id: 'post-' + id,
        attributes: {
          title: 'This is teh post title for ' + id,
          author: 'Yo',
          body: 'This is the post text for ' + id
        }
      }
    ]
  });
}
