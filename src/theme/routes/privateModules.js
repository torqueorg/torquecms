async function privateHome(req, res, next) {
  try {
    res.render('privateModules', { layout: 'layoutPrivate' });
  } catch (err) {
    res.send(err);
  }
}

export default privateHome;
