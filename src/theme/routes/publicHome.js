async function publicHome(req, res, next) {
  try {
    res.render('publicIndex', {
      title: 'EXAMPLE'
    });
  } catch (err) {
    res.render('error', { error: err });
  }
}

export default publicHome;
