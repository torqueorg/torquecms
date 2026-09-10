function privateApi(req, res, next) {
  try {
    res.send({
      api: 'Welcome to API!',
      data: []
    });
  } catch (err) {
    res.render('error', { error: err });
  }
}

export default privateApi;
